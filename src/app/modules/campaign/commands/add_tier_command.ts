/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { CampaignStore } from '../stores/campaign';
import { CampaignCreated } from '../events/campaign_created';
import { addTierCommandParamsSchema } from '../schemas';
import { Campaign, AddTierCommandParams, ContributionTier } from '../types';

export class AddTierCommand extends Modules.BaseCommand {
	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<AddTierCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const { params } = context;
		const campaignStore = this.stores.get(CampaignStore);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaignExists = await campaignStore.has(context, campaignId);
		if (!campaignExists) {
			throw new Error('Campaign does not exist.');
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
		// Create campaign object
		const updatedCampaign: Campaign = {
			...campaign,
			contributionTiers: [...campaign.contributionTiers, newTier],
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, updatedCampaign);

		const contributionTierAdded = this.events.get(CampaignCreated);
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
