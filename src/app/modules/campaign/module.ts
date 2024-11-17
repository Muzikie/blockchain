/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { Modules } from 'klayr-sdk';
import { CampaignEndpoint } from './endpoint';
import { CampaignMethod } from './method';
import { CampaignStore } from './stores/campaign';
import { CampaignAccountStore } from './stores/campaign_account';
import { CampaignCreated } from './events/campaign_created';
import { CreateCommand } from './commands/create_command';

export class CampaignModule extends Modules.BaseModule {
	public endpoint = new CampaignEndpoint(this.stores, this.offchainStores);
	public method = new CampaignMethod(this.stores, this.events);
	public commands = [new CreateCommand(this.stores, this.events)];

	public constructor() {
		super();
		this.stores.register(CampaignAccountStore, new CampaignAccountStore(this.name, 0));
		this.stores.register(CampaignStore, new CampaignStore(this.name, 1));
		this.events.register(CampaignCreated, new CampaignCreated(this.name));
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
