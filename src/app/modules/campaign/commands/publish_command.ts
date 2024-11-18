/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { address as cryptoAddress } from '@klayr/cryptography';
import { CampaignStore } from '../stores/campaign';
import { CampaignPublished } from '../events/campaign_published';
import { publishCommandParamsSchema } from '../schemas';
import { Campaign, CampaignStatus, PublishCommandParams } from '../types';

export class PublishCommand extends Modules.BaseCommand {
	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<PublishCommandParams>,
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
		if (campaign.contributionTiers.length === 0) {
			throw new Error('Campaigns need at least one contribution tier.');
		}
		if (campaign.contributionTiers.length > 5) {
			throw new Error('Campaigns may only have up to 5 contribution tiers.');
		}
		if (campaign.status === CampaignStatus.Draft) {
			throw new Error(
				`You can only publish a campaign in draft mode. Campaign current status: ${campaign.status}`,
			);
		}
		if (Buffer.compare(campaign.submitter, senderAddress) !== 0) {
			throw new Error(
				`You can only publish your own campaign, campaign creator: ${cryptoAddress.getKlayr32AddressFromAddress(
					campaign.submitter,
				)}`,
			);
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<PublishCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
		} = context;

		const campaignStore = this.stores.get(CampaignStore);

		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaign = await campaignStore.get(context, campaignId);
		// Create campaign object
		const updatedCampaign: Campaign = {
			...campaign,
			status: CampaignStatus.Published,
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, updatedCampaign);

		const contributionTierAdded = this.events.get(CampaignPublished);
		contributionTierAdded.add(
			context,
			{
				submitter: senderAddress,
				campaignId,
			},
			[senderAddress],
		);
	}

	public schema = publishCommandParamsSchema;
}
