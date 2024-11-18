/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { Modules } from 'klayr-sdk';

// Commands
import { AddTierCommand } from './commands/add_tier_command';
import { ContributeCommand } from './commands/contribute_command';
import { CreateCommand } from './commands/create_command';
import { PublishCommand } from './commands/publish_command';
import { PayoutCommand } from './commands/payout_command';

// Events
import { CampaignCreated } from './events/campaign_created';
import { ContributionTierAdded } from './events/contribution_tier_added';
import { ContributionProcessed } from './events/contribution_processed';
import { CampaignPublished } from './events/campaign_published';
import { CampaignPayoutProcessed } from './events/campaign_payout_processed';

// Stores
import { CampaignAccountStore } from './stores/campaign_account';
import { CampaignStore } from './stores/campaign';
import { ContributionStore } from './stores/contribution';

// Endpoints and methods
import { CampaignEndpoint } from './endpoint';
import { CampaignMethod } from './method';

export class CampaignModule extends Modules.BaseModule {
	public endpoint = new CampaignEndpoint(this.stores, this.offchainStores);
	public method = new CampaignMethod(this.stores, this.events);
	public commands = [
		new CreateCommand(this.stores, this.events),
		new AddTierCommand(this.stores, this.events),
		new PublishCommand(this.stores, this.events),
		new ContributeCommand(this.stores, this.events),
		new PayoutCommand(this.stores, this.events),
	];

	public constructor() {
		super();

		// Stores
		this.stores.register(CampaignAccountStore, new CampaignAccountStore(this.name, 0));
		this.stores.register(CampaignStore, new CampaignStore(this.name, 1));
		this.stores.register(ContributionStore, new ContributionStore(this.name, 1));

		// Events
		this.events.register(CampaignCreated, new CampaignCreated(this.name));
		this.events.register(ContributionTierAdded, new ContributionTierAdded(this.name));
		this.events.register(CampaignPublished, new CampaignPublished(this.name));
		this.events.register(ContributionProcessed, new ContributionProcessed(this.name));
		this.events.register(CampaignPayoutProcessed, new CampaignPayoutProcessed(this.name));
	}

	public metadata(): Modules.ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [],
			assets: [],
		};
	}

	// Lifecycle hooks
	// public async init(_args: Modules.ModuleInitArgs): Promise<void> {
	// 	// initialize this module when starting a node
	// }

	// public async insertAssets(_context: StateMachine.InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: StateMachine.BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	// public async verifyTransaction(_context: StateMachine.TransactionVerifyContext): Promise<StateMachine.VerificationResult> {
	// verify transaction will be called multiple times in the transaction pool
	// return { status: StateMachine.VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {}

	// public async afterCommandExecute(_context: StateMachine.TransactionExecuteContext): Promise<void> {}

	// public async initGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {}

	// public async finalizeGenesisState(_context: StateMachine.GenesisBlockExecuteContext): Promise<void> {}

	// public async beforeTransactionsExecute(_context: StateMachine.BlockExecuteContext): Promise<void> {}

	// public async afterTransactionsExecute(_context: StateMachine.BlockAfterExecuteContext): Promise<void> {
}
