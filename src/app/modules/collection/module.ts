/* eslint-disable class-methods-use-this */

import {
  BaseModule,
  ModuleInitArgs,
  InsertAssetContext,
  BlockVerifyContext,
  TransactionVerifyContext,
  VerificationResult,
  ModuleMetadata,
  // TransactionExecuteContext,
  // GenesisBlockExecuteContext,
  // BlockExecuteContext,
  // BlockAfterExecuteContext,
} from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VerifyStatus } from 'lisk-framework';
import { CollectionEndpoint } from './endpoint';
import { CollectionMethod } from './method';
import { CollectionAccountStore } from './stores/collectionAccount';
import { DestroyCommand } from "./commands/destroy_command";
import { CollectionStore } from './stores/collection';
import { CreateCommand } from "./commands/create_command";

export class CollectionModule extends BaseModule {
    public endpoint = new CollectionEndpoint(this.stores, this.offchainStores);
    public method = new CollectionMethod(this.stores, this.events);
    public commands = [
      new CreateCommand(this.stores, this.events),
      new DestroyCommand(this.stores, this.events),
    ];

    public constructor() {
      super();
      this.stores.register(CollectionAccountStore, new CollectionAccountStore(this.name));
      this.stores.register(CollectionStore, new CollectionStore(this.name));
    }

    public metadata(): ModuleMetadata {
      return {
        name: '',
        endpoints: [],
        commands: this.commands.map(command => ({
          name: command.name,
          params: command.schema,
        })),
        events: this.events.values().map(v => ({
          name: v.name,
          data: v.schema,
        })),
        assets: [],
      };
    }

    // Lifecycle hooks
    public async init(_args: ModuleInitArgs): Promise<void> {
    // initialize this module when starting a node
    }

    public async insertAssets(_context: InsertAssetContext) {
    // initialize block generation, add asset
    }

    public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
    // verify block
    }

    // Lifecycle hooks
    // eslint-disable-next-line @typescript-eslint/require-await
    public async verifyTransaction(_context: TransactionVerifyContext): Promise<VerificationResult> {
    // verify transaction will be called multiple times in the transaction pool
      return {
        status: VerifyStatus.OK,
      };
    }

  // public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {}

  // public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {}

  // public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {}

  // public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {}
}
