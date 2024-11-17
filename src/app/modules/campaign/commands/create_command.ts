/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { CampaignStore } from '../stores/campaign';
import { CampaignAccountStore } from '../stores/campaign_account';
import { CampaignCreated } from '../events/campaign_created';
import { createCommandParamsSchema } from '../schemas';
import { CreateCommandParams, Campaign, CampaignStatus, CampaignAccount } from '../types';
import { getCampaignId } from '../utils';

export class CreateCommand extends Modules.BaseCommand {
	public async verify(
		context: StateMachine.CommandVerifyContext<CreateCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const { params } = context;
		const campaignStore = this.stores.get(CampaignStore);
		const campaignId = getCampaignId(params);

		const campaignExists = await campaignStore.has(context, campaignId);
		if (campaignExists) {
			throw new Error('This campaign already exist.');
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<CreateCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
		} = context;

		const campaignAccountStore = this.stores.get(CampaignAccountStore);
		const campaignStore = this.stores.get(CampaignStore);

		// Create campaign ID
		const campaignId = getCampaignId(params);

		// Create campaign object
		const campaign: Campaign = {
			softGoal: BigInt(params.softGoal),
			hardGoal: BigInt(params.hardGoal),
			currentFunding: BigInt(0),
			status: CampaignStatus.Draft,
			deadline: params.deadline,
			apiId: params.apiId,
			contributionTiers: [],
			id: campaignId,
			submitter: senderAddress,
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignId, campaign);

		// Get the sender account from the blockchain
		const senderExists = await campaignAccountStore.has(context, senderAddress);
		let senderAccount: CampaignAccount;
		if (!senderExists) {
			senderAccount = {
				campaigns: [campaignId],
			};
		} else {
			const retrievedAccount = await campaignAccountStore.get(context, senderAddress);
			senderAccount = {
				campaigns: [...retrievedAccount.campaigns, campaignId],
			};
		}

		// Store the account object in the blockchain
		await campaignAccountStore.set(context, senderAddress, senderAccount);

		const campaignCreated = this.events.get(CampaignCreated);
		campaignCreated.add(
			context,
			{
				submitter: senderAddress,
				campaignId,
			},
			[senderAddress],
		);
	}

	public schema = createCommandParamsSchema;
}
