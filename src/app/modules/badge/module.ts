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
  // TransactionExecuteContext,
  // GenesisBlockExecuteContext,
  // BlockExecuteContext,
  // BlockAfterExecuteContext,
} from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TokenMethod, VerifyStatus } from 'lisk-framework';
import { CreateCommand } from './commands/create_command';
import { DestroyCommand } from './commands/destroy_command';
import { ClaimCommand } from './commands/claim_command';
import { BadgeCreated } from './events/badgeCreated';
import { BadgeEndpoint } from './endpoint';
import {
  accountStoreSchema,
  badgeStoreSchema,
  idRequestSchema,
  addressRequestSchema,
} from './schemas';
import { BadgeMethod } from './method';
import { BadgeAccountStore } from './stores/badgeAccount';
import { BadgeStore } from './stores/badge';
import { AnchorMethod } from '../anchor/method';

export class BadgeModule extends BaseModule {
public endpoint = new BadgeEndpoint(this.stores, this.offchainStores);
public method = new BadgeMethod(this.stores, this.events);

private readonly _createCommand = new CreateCommand(this.stores, this.events);
private readonly _destroyCommand = new DestroyCommand(this.stores, this.events);
private readonly _claimCommands = new ClaimCommand(this.stores, this.events);

// eslint-disable-next-line @typescript-eslint/member-ordering
public commands = [
  this._createCommand,
  this._destroyCommand,
  this._claimCommands,
];

private _tokenMethod!: TokenMethod;
private _anchorMethod!: AnchorMethod;

public constructor() {
  super();
  this.stores.register(BadgeAccountStore, new BadgeAccountStore(this.name, 0));
  this.stores.register(BadgeStore, new BadgeStore(this.name, 1));
  this.events.register(BadgeCreated, new BadgeCreated(this.name));
}

public addDependencies(
  tokenMethod: TokenMethod,
  anchorMethod: AnchorMethod,
): void {
  this._tokenMethod = tokenMethod;
  this._anchorMethod = anchorMethod;
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  this._claimCommands.addDependencies(this._tokenMethod, this._anchorMethod);
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
        name: this.endpoint.getBadge.name,
        request: idRequestSchema,
        response: badgeStoreSchema,
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
