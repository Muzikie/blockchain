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
  TransactionExecuteContext,
  // GenesisBlockExecuteContext,
  // BlockExecuteContext,
  // BlockAfterExecuteContext,
} from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TokenMethod, VerifyStatus } from 'lisk-framework';
import { CreateCommand } from './commands/create_command';
import { DestroyCommand } from './commands/destroy_command';
import { TransferCommand } from './commands/transfer_command';
import { StreamCommand } from './commands/stream_command';
import { ReclaimCommand } from './commands/reclaim_command';
import { SetAttributesCommand } from './commands/set_attributes_command';
import { BadgeCreated } from './events/badgeCreated';
import { BadgeStreamed } from './events/badgeStreamed';
import { BadgeIncomeReclaimed } from './events/badgeIncomeReclaimed';
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
// import { COMMANDS, MODULES } from '../../constants';

export class BadgeModule extends BaseModule {
public endpoint = new BadgeEndpoint(this.stores, this.offchainStores);
public method = new BadgeMethod(this.stores, this.events);

private readonly _createCommand = new CreateCommand(this.stores, this.events);
private readonly _destroyCommand = new DestroyCommand(this.stores, this.events);
private readonly _transferCommand = new TransferCommand(this.stores, this.events);
private readonly _setAttributesCommand = new SetAttributesCommand(this.stores, this.events);
private readonly _streamCommands = new StreamCommand(this.stores, this.events);
private readonly _reclaimCommands = new ReclaimCommand(this.stores, this.events);

// eslint-disable-next-line @typescript-eslint/member-ordering
public commands = [
  this._createCommand,
  this._destroyCommand,
  this._transferCommand,
  this._setAttributesCommand,
  this._streamCommands,
  this._reclaimCommands,
];

private _anchorMethod!: AnchorMethod;
private _tokenMethod!: TokenMethod;

public constructor() {
  super();
  this.stores.register(BadgeAccountStore, new BadgeAccountStore(this.name, 0));
  this.stores.register(BadgeStore, new BadgeStore(this.name, 1));
  this.events.register(BadgeCreated, new BadgeCreated(this.name));
  this.events.register(BadgeStreamed, new BadgeStreamed(this.name));
  this.events.register(BadgeIncomeReclaimed, new BadgeIncomeReclaimed(this.name));
}

public addDependencies(
  anchorMethod: AnchorMethod,
  tokenMethod: TokenMethod,
): void {
  this._anchorMethod = anchorMethod;
  this._tokenMethod = tokenMethod;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  this._streamCommands.addDependencies(this._anchorMethod);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  this._reclaimCommands.addDependencies(this._tokenMethod);
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

public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
  // const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
  // const badgeSubStore = this.stores.get(BadgeStore);

//   if (
//     context.transaction.command === COMMANDS.DESTROY &&
// context.transaction.module === MODULES.AUDIO
//   ) {
//     const account = await badgeAccountSubStore.get(context, context.transaction.senderAddress);
//     const badgeID = account.badge.badges[account.badge.badges.length - 1];
//     if (badgeID) {
//       const { collectionID } = await badgeSubStore.get(context, badgeID);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//       await this._collectionMethod.removeBadge(
//         context.getMethodContext(),
//         badgeID,
//         collectionID,
//         context.transaction.senderAddress,
//       );
//     }
//   }
}

public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {
  // const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
  // const badgeSubStore = this.stores.get(BadgeStore);

  // if (
  //   context.transaction.command === COMMANDS.CREATE &&
  //   context.transaction.module === MODULES.AUDIO
  // ) {
  //   const account = await badgeAccountSubStore.get(context, context.transaction.senderAddress);
  //   const badgeID = account.badge.badges[account.badge.badges.length - 1];
  //   if (badgeID) {
  //     const { collectionID } = await badgeSubStore.get(context, badgeID);
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  //     await this._collectionMethod.addBadge(
  //       context.getMethodContext(),
  //       badgeID,
  //       collectionID,
  //       context.transaction.senderAddress,
  //     );
  //   }
  // }
}

  // public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {}

  // public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {}
}
