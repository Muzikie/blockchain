/* eslint-disable class-methods-use-this */
import { Modules, StateMachine } from 'klayr-sdk';
import { CampaignStore } from '../stores/campaign';
import { TREASURY_ADDRESS, TRANSFER_FEE } from '../constants';
import { CampaignReimbursementProcessed } from '../events/campaign_reimbursement_processed';
import { reimburseCommandParamsSchema } from '../schemas';
import { CampaignStatus, Contribution, ReimburseCommandParams } from '../types';
import { ContributionStore } from '../stores/contribution';
import { getContributionId } from '../utils';

export class ReimburseCommand extends Modules.BaseCommand {
	public addDependencies(tokenMethod: Modules.Token.TokenMethod) {
		this._tokenMethod = tokenMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		context: StateMachine.CommandVerifyContext<ReimburseCommandParams>,
	): Promise<StateMachine.VerificationResult> {
		const {
			params,
			transaction: { senderAddress },
		} = context;
		const campaignStore = this.stores.get(CampaignStore);
		const contributionStore = this.stores.get(ContributionStore);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaignExists = await campaignStore.has(context, campaignId);
		if (!campaignExists) {
			throw new Error('Campaign does not exist.');
		}
		const campaign = await campaignStore.get(context, campaignId);
		if (campaign.status === CampaignStatus.Failed) {
			throw new Error('This campaign is failed. Reimbursements are accomplished');
		}

		const potentialIds = campaign.contributionTiers.map(({ apiId }) =>
			getContributionId({
				campaignId: params.campaignId,
				address: senderAddress,
				tierId: apiId,
			}),
		);

		const contributionsExist: boolean[] = [];
		for await (const id of potentialIds) {
			const contributionExist = await contributionStore.has(context, id);
			contributionsExist.push(contributionExist);
		}
		if (!contributionsExist.some(item => item)) {
			throw new Error('You have not contributed in this campaign.');
		}

		return { status: StateMachine.VerifyStatus.OK };
	}

	public async execute(
		context: StateMachine.CommandExecuteContext<ReimburseCommandParams>,
	): Promise<void> {
		const {
			params,
			transaction: { senderAddress },
			chainID,
		} = context;
		const methodContext = context.getMethodContext();
		const campaignStore = this.stores.get(CampaignStore);
		const contributionStore = this.stores.get(ContributionStore);
		const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
		const campaignId = Buffer.from(params.campaignId, 'hex');

		const campaign = await campaignStore.get(context, campaignId);

		const potentialIds = campaign.contributionTiers.map(({ apiId }) =>
			getContributionId({
				campaignId: params.campaignId,
				address: senderAddress,
				tierId: apiId,
			}),
		);
		const contributions: (Contribution & { id: Buffer })[] = [];
		for await (const id of potentialIds) {
			const contributionExist = await contributionStore.has(context, id);
			if (contributionExist) {
				const contribution = await contributionStore.get(context, id);
				contributions.push({
					...contribution,
					id,
				});
			}
		}

		// Reimburse the contribution amount
		const totalContributions = contributions.reduce((total, item) => {
			const sum = total + item.amount;
			return sum;
		}, BigInt(0));
		const payable =
			totalContributions <= campaign.currentFunding ? totalContributions : campaign.currentFunding;
		await this._tokenMethod.transfer(
			methodContext,
			TREASURY_ADDRESS,
			senderAddress,
			tokenID,
			payable - TRANSFER_FEE,
		);

		// Update campaign
		const remainingFunds = campaign.currentFunding - payable;
		const status = remainingFunds > 0 ? CampaignStatus.Failing : CampaignStatus.Failed;
		const updatedCampaign = {
			...campaign,
			currentFunding: remainingFunds,
			status,
		};
		await campaignStore.set(context, campaignId, updatedCampaign);

		// Delete the contributions
		for await (const item of contributions) {
			await contributionStore.del(context, item.id);
		}

		// Fire event
		const reimbursementProcessed = this.events.get(CampaignReimbursementProcessed);
		reimbursementProcessed.add(
			context,
			{
				submitter: senderAddress,
				amount: payable - TRANSFER_FEE,
				campaignId,
			},
			[senderAddress],
		);
	}

	public schema = reimburseCommandParamsSchema;
	private _tokenMethod!: Modules.Token.TokenMethod;
}
