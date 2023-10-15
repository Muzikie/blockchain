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
import { AudioCreated } from './events/audioCreated';
import { AudioStreamed } from './events/audioStreamed';
import { AudioIncomeReclaimed } from './events/audioIncomeReclaimed';
import { AudioEndpoint } from './endpoint';
import {
  accountStoreSchema,
  audioStoreSchema,
  idRequestSchema,
  addressRequestSchema,
} from './schemas';
import { AudioMethod } from './method';
import { AudioAccountStore } from './stores/audioAccount';
import { AudioStore } from './stores/audio';
import { CollectionMethod } from '../collection/method';
import { SubscriptionMethod } from '../subscription/method';
import { COMMANDS, MODULES } from '../../constants';

export class AudioModule extends BaseModule {
public endpoint = new AudioEndpoint(this.stores, this.offchainStores);
public method = new AudioMethod(this.stores, this.events);

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

private _collectionMethod!: CollectionMethod;
private _subscriptionMethod!: SubscriptionMethod;
private _tokenMethod!: TokenMethod;

public constructor() {
  super();
  this.stores.register(AudioAccountStore, new AudioAccountStore(this.name, 0));
  this.stores.register(AudioStore, new AudioStore(this.name, 1));
  this.events.register(AudioCreated, new AudioCreated(this.name));
  this.events.register(AudioStreamed, new AudioStreamed(this.name));
  this.events.register(AudioIncomeReclaimed, new AudioIncomeReclaimed(this.name));
}

public addDependencies(
  collectionMethod: CollectionMethod,
  subscriptionMethod: SubscriptionMethod,
  tokenMethod: TokenMethod,
): void {
  this._collectionMethod = collectionMethod;
  this._subscriptionMethod = subscriptionMethod;
  this._tokenMethod = tokenMethod;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  this._streamCommands.addDependencies(this._subscriptionMethod);
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
        name: this.endpoint.getAudio.name,
        request: idRequestSchema,
        response: audioStoreSchema,
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

public async beforeCommandExecute(context: TransactionExecuteContext): Promise<void> {
  const audioAccountSubStore = this.stores.get(AudioAccountStore);
  const audioSubStore = this.stores.get(AudioStore);

  if (
    context.transaction.command === COMMANDS.DESTROY &&
context.transaction.module === MODULES.AUDIO
  ) {
    const account = await audioAccountSubStore.get(context, context.transaction.senderAddress);
    const audioID = account.audio.audios[account.audio.audios.length - 1];
    if (audioID) {
      const { collectionID } = await audioSubStore.get(context, audioID);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this._collectionMethod.removeAudio(
        context.getMethodContext(),
        audioID,
        collectionID,
        context.transaction.senderAddress,
      );
    }
  }
}

public async afterCommandExecute(context: TransactionExecuteContext): Promise<void> {
  const audioAccountSubStore = this.stores.get(AudioAccountStore);
  const audioSubStore = this.stores.get(AudioStore);

  if (
    context.transaction.command === COMMANDS.CREATE &&
    context.transaction.module === MODULES.AUDIO
  ) {
    const account = await audioAccountSubStore.get(context, context.transaction.senderAddress);
    const audioID = account.audio.audios[account.audio.audios.length - 1];
    if (audioID) {
      const { collectionID } = await audioSubStore.get(context, audioID);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this._collectionMethod.addAudio(
        context.getMethodContext(),
        audioID,
        collectionID,
        context.transaction.senderAddress,
      );
    }
  }
}

  // public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {}

  // public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {}
}
