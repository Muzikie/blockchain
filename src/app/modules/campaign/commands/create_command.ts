/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { CampaignStore } from '../stores/campaign';
import { CampaignAccountStore } from '../stores/campaign_account';
import { CampaignCreated } from '../events/campaign_created';
import { createCommandParamsSchema } from '../schemas';
import { CreateCommandParams, Campaign, CampaignStatus, CampaignAccount } from '../types';
import { getCampaignID } from '../utils';

export class CreateCommand extends Modules.BaseCommand {
	public async verify(
		context: StateMachine.CommandVerifyContext<CreateCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const campaignStore = this.stores.get(CampaignStore);
		const campaignID = getCampaignID(context.params);

		const campaignExists = await campaignStore.has(context, campaignID);
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
		const campaignID = getCampaignID(context.params);

		// Create campaign object
		const campaign: Campaign = {
			softGoal: BigInt(params.softGoal),
			hardGoal: BigInt(params.hardGoal),
			currentFunding: BigInt(0),
			status: CampaignStatus.Draft,
			deadline: params.deadline,
			apiId: params.apiId,
			id: campaignID,
			submitter: senderAddress,
		};

		// Store the campaign object in the blockchain
		await campaignStore.set(context, campaignID, campaign);

		// Get the sender account from the blockchain
		const senderExists = await campaignAccountStore.has(context, senderAddress);
		let senderAccount: CampaignAccount;
		if (!senderExists) {
			senderAccount = {
				campaigns: [campaignID],
			};
		} else {
			const retrievedAccount = await campaignAccountStore.get(context, senderAddress);
			senderAccount = {
				campaigns: [...retrievedAccount.campaigns, campaignID],
			};
		}

		// Store the account object in the blockchain
		await campaignAccountStore.set(context, senderAddress, senderAccount);

		const campaignCreated = this.events.get(CampaignCreated);
		campaignCreated.add(
			context,
			{
				submitter: context.transaction.senderAddress,
				campaignID,
			},
			[context.transaction.senderAddress],
		);
	}

	public schema = createCommandParamsSchema;
}
