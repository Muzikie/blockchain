/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { address as cryptoAddress } from '@klayr/cryptography';
import { CampaignStore } from '../stores/campaign';
import { ContributionTierAdded } from '../events/contribution_tier_added';
import { addTierCommandParamsSchema } from '../schemas';
import { Campaign, AddTierCommandParams, ContributionTier, CampaignStatus } from '../types';

export class AddTierCommand extends Modules.BaseCommand {
	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<AddTierCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const {
			params,
			transaction: { senderAddress },
		} = context;
		const campaignStore = this.stores.get(CampaignStore);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaignExists = await campaignStore.has(context, campaignId);
		if (!campaignExists) {
			throw new Error('Campaign does not exist.');
		}

		const campaign = await campaignStore.get(context, campaignId);
		if (campaign.contributionTiers.length >= 5) {
			throw new Error('Campaigns may only have up to 5 contribution tiers.');
		}
		if (campaign.status === CampaignStatus.Draft) {
			throw new Error(
				`You can only update a campaign in draft mode. Campaign current status: ${campaign.status}`,
			);
		}
		if (Buffer.compare(campaign.submitter, senderAddress) !== 0) {
			throw new Error(
				`You can only edit your own campaign, campaign creator: ${cryptoAddress.getKlayr32AddressFromAddress(
					campaign.submitter,
				)}`,
			);
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<AddTierCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
		} = context;

		const campaignStore = this.stores.get(CampaignStore);

		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaign = await campaignStore.get(context, campaignId);
		const newTier: ContributionTier = {
			amount: BigInt(params.amount),
			apiId: params.apiId,
		};
		// Update campaign object
		const updatedCampaign: Campaign = {
			...campaign,
			contributionTiers: [...campaign.contributionTiers, newTier],
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, updatedCampaign);

		const contributionTierAdded = this.events.get(ContributionTierAdded);
		contributionTierAdded.add(
			context,
			{
				submitter: senderAddress,
				campaignId,
			},
			[senderAddress],
		);
	}

	public schema = addTierCommandParamsSchema;
}
