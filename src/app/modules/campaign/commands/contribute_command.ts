/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { CampaignStore } from '../stores/campaign';
import { ContributionStore } from '../stores/contribution';
import { ContributionProcessed } from '../events/contribution_processed';
import { contributeCommandParamsSchema } from '../schemas';
import { CONTRIBUTION_FEE, TREASURY_ADDRESS } from '../constants';
import { getContributionId } from '../utils';
import {
	Campaign,
	CampaignStatus,
	ContributeCommandParams,
	Contribution,
	ContributionTier,
} from '../types';

export class ContributeCommand extends Modules.BaseCommand {
	public addDependencies(tokenMethod: Modules.Token.TokenMethod) {
		this._tokenMethod = tokenMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<ContributeCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const { params } = context;
		const campaignStore = this.stores.get(CampaignStore);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaignExists = await campaignStore.has(context, campaignId);
		if (campaignExists) {
			throw new Error('Campaign does not exist.');
		}

		const campaign = await campaignStore.get(context, campaignId);
		const tier = campaign.contributionTiers.find(item => item.apiId === params.tierId);
		if (!tier) {
			throw new Error('Contribution tier does not exist.');
		}
		if (campaign.status === CampaignStatus.Draft) {
			throw new Error('You can not contribute to a campaign in draft mode.');
		}
		if (campaign.status === CampaignStatus.SoldOut) {
			throw new Error('Campaign is already sold out and no longer accepts contributions.');
		}
		if (campaign.status === CampaignStatus.Failed || campaign.status === CampaignStatus.Failing) {
			throw new Error('Campaign has failed and no longer accepts contributions.');
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<ContributeCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
			chainID,
		} = context;
		const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
		const methodContext = context.getMethodContext();

		const campaignStore = this.stores.get(CampaignStore);
		const contributionStore = this.stores.get(ContributionStore);

		const campaignId = Buffer.from(params.campaignId, 'hex');
		const campaign = await campaignStore.get(context, campaignId);
		// The existence is already asserted
		const tier = campaign.contributionTiers.find(
			item => item.apiId === params.tierId,
		) as ContributionTier;

		// Update campaign object
		const updatedFunding = campaign.currentFunding + tier.amount;
		const updatedCampaign: Campaign = {
			...campaign,
			currentFunding: updatedFunding,
		};
		const contribution: Contribution = {
			tierId: params.tierId,
			campaignId: Buffer.from(params.campaignId, 'hex'),
			address: senderAddress,
			amount: tier.amount,
		};
		const contributionId = getContributionId({
			campaignId: params.campaignId,
			tierId: params.tierId,
			address: senderAddress,
		});

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, updatedCampaign);
		await contributionStore.set(context, contributionId, contribution);

		// Collect the contribution fee
		await this._tokenMethod.transfer(
			methodContext,
			senderAddress,
			TREASURY_ADDRESS,
			tokenID,
			CONTRIBUTION_FEE,
		);

		const contributionProcessed = this.events.get(ContributionProcessed);
		contributionProcessed.add(
			context,
			{
				updatedFunding,
				campaignId,
				submitter: senderAddress,
			},
			[senderAddress],
		);
	}

	public schema = contributeCommandParamsSchema;
	private _tokenMethod!: Modules.Token.TokenMethod;
}
