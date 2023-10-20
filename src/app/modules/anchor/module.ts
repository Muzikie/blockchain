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
  anchorStoreSchema,
  hasAnchorResponse,
} from './schemas';
import { AnchorEndpoint } from './endpoint';
import { AnchorMethod } from './method';
import { AnchorStore } from './stores/anchor';
import { AnchorAccountStore } from './stores/anchorAccount';
import { AnchorCreated } from './events/anchorCreated';
import { CreateCommand } from './commands/create_command';
import { VoteCommand } from './commands/vote_command';

export class AnchorModule extends BaseModule {
  public endpoint = new AnchorEndpoint(this.stores, this.offchainStores);
  public method = new AnchorMethod(this.stores, this.events);

  private readonly _createCommand = new CreateCommand(this.stores, this.events);
  private readonly _purchaseCommand = new VoteCommand(this.stores, this.events);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public commands = [this._createCommand, this._purchaseCommand];

  private _tokenMethod!: TokenMethod;

  public constructor() {
    super();
    this.stores.register(AnchorAccountStore, new AnchorAccountStore(this.name, 0));
    this.stores.register(AnchorStore, new AnchorStore(this.name, 1));
    this.events.register(AnchorCreated, new AnchorCreated(this.name));
  }

  public addDependencies(tokenMethod: TokenMethod): void {
    this._tokenMethod = tokenMethod;

    this._purchaseCommand.addDependencies(this._tokenMethod);
g  }

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
          name: this.endpoint.getAnchor.name,
          request: idRequestSchema,
          response: anchorStoreSchema,
        },
        {
          name: this.endpoint.hasAnchor.name,
          request: addressRequestSchema,
          response: hasAnchorResponse,
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
