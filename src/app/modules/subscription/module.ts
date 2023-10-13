/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseModule,
  ModuleInitArgs,
  InsertAssetContext,
  BlockVerifyContext,
  TransactionVerifyContext,
  VerificationResult,
  ModuleMetadata,
  TokenMethod,
  // TransactionExecuteContext,
  // GenesisBlockExecuteContext,
  // BlockExecuteContext,
  // BlockAfterExecuteContext,
} from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { VerifyStatus } from 'lisk-framework';
import {
  accountStoreSchema,
  addressRequestSchema,
  idRequestSchema,
  subscriptionStoreSchema,
  hasSubscriptionResponse,
} from './schemas';
import { SubscriptionEndpoint } from './endpoint';
import { SubscriptionMethod } from './method';
import { SubscriptionStore } from './stores/subscription';
import { SubscriptionAccountStore } from './stores/subscriptionAccount';
import { SubscriptionCreated } from './events/subscriptionCreated';
import { CreateCommand } from './commands/create_command';
import { PurchaseCommand } from './commands/purchase_command';
import { UpdateMembersCommand } from './commands/update_members_command';

export class SubscriptionModule extends BaseModule {
  public endpoint = new SubscriptionEndpoint(this.stores, this.offchainStores);
  public method = new SubscriptionMethod(this.stores, this.events);

  private readonly _createCommand = new CreateCommand(this.stores, this.events);
  private readonly _purchaseCommand = new PurchaseCommand(this.stores, this.events);
  private readonly _updateMembersCommand = new UpdateMembersCommand(this.stores, this.events);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public commands = [this._createCommand, this._purchaseCommand, this._updateMembersCommand];

  private _tokenMethod!: TokenMethod;

  public constructor() {
    super();
    this.stores.register(SubscriptionAccountStore, new SubscriptionAccountStore(this.name, 0));
    this.stores.register(SubscriptionStore, new SubscriptionStore(this.name, 1));
    this.events.register(SubscriptionCreated, new SubscriptionCreated(this.name));
  }

  public addDependencies(tokenMethod: TokenMethod): void {
    this._tokenMethod = tokenMethod;

    this._purchaseCommand.addDependencies(this._tokenMethod);
  }

  public metadata(): ModuleMetadata {
    return {
      ...this.baseMetadata(),
      endpoints: [
        {
          name: this.endpoint.getAccount.name,
          request: addressRequestSchema,
          response: accountStoreSchema,
        },
        {
          name: this.endpoint.getSubscription.name,
          request: idRequestSchema,
          response: subscriptionStoreSchema,
        },
        {
          name: this.endpoint.hasSubscription.name,
          request: addressRequestSchema,
          response: hasSubscriptionResponse,
        },
      ],
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
