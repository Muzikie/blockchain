/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { address as cryptoAddress } from '@klayr/cryptography';
import { CampaignStore } from '../stores/campaign';
import { CampaignPayoutProcessed } from '../events/campaign_payout_processed';
import { payoutCommandParamsSchema } from '../schemas';
import { Campaign, CampaignStatus, PayoutCommandParams } from '../types';
import { DEV_ADDRESS, DEV_SHARE } from '../constants';

export class PayoutCommand extends Modules.BaseCommand {
	public addDependencies(tokenMethod: Modules.Token.TokenMethod) {
		this._tokenMethod = tokenMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<PayoutCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const {
			params,
			transaction: { senderAddress },
		} = context;
		const campaignStore = this.stores.get(CampaignStore);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaignExists = await campaignStore.has(context, campaignId);
		if (campaignExists) {
			throw new Error('Campaign does not exist.');
		}

		const campaign = await campaignStore.get(context, campaignId);
		const deadlineReached = new Date().getTime() >= new Date(campaign.deadline).getTime();
		if (
			campaign.status !== CampaignStatus.SoldOut &&
			campaign.status !== CampaignStatus.Successful &&
			deadlineReached
		) {
			throw new Error(
				`You can only withdraw funds of a campaign after the deadline. Campaign deadline: ${campaign.deadline}`,
			);
		}
		if (
			campaign.status !== CampaignStatus.SoldOut &&
			campaign.status !== CampaignStatus.Successful
		) {
			throw new Error(
				`You can only withdraw funds of a successful campaign. Campaign current status: ${campaign.status}`,
			);
		}
		if (Buffer.compare(campaign.submitter, senderAddress) !== 0) {
			throw new Error(
				`You can only withdraw funds of your own campaign, campaign creator: ${cryptoAddress.getKlayr32AddressFromAddress(
					campaign.submitter,
				)}`,
			);
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<PayoutCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
			chainID,
		} = context;
		const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
		const methodContext = context.getMethodContext();

		const campaignStore = this.stores.get(CampaignStore);

		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaign = await campaignStore.get(context, campaignId);
		// Create campaign object
		const updatedCampaign: Campaign = {
			...campaign,
			status: CampaignStatus.Withdrawn,
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, updatedCampaign);
		const devShare = DEV_SHARE * campaign.currentFunding;
		const ownerShare = campaign.currentFunding - devShare;

		// Transfer tokens
		await this._tokenMethod.transfer(methodContext, senderAddress, DEV_ADDRESS, tokenID, devShare);
		await this._tokenMethod.transfer(
			methodContext,
			senderAddress,
			senderAddress,
			tokenID,
			ownerShare,
		);

		// Fire event
		const payoutProcessed = this.events.get(CampaignPayoutProcessed);
		payoutProcessed.add(
			context,
			{
				submitter: senderAddress,
				amount: ownerShare,
				campaignId,
			},
			[senderAddress],
		);
	}

	public schema = payoutCommandParamsSchema;
	private _tokenMethod!: Modules.Token.TokenMethod;
}
