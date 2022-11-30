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
import { VerifyStatus } from 'lisk-framework';
import { CreateCommand } from "./commands/create_command";
import { DestroyCommand } from "./commands/destroy_command";
import { TransferCommand } from "./commands/transfer_command";
import { SetAttributesCommand } from "./commands/set_attributes_command";
import { CreateEvent } from "./events/create";
import { AudioEndpoint } from './endpoint';
import { AudioMethod } from './method';
import { AudioAccountStore } from './stores/audioAccount';
import { AudioStore } from './stores/audio';
import { CollectionMethod } from '../collection/method';

export class AudioModule extends BaseModule {
    public endpoint = new AudioEndpoint(this.stores, this.offchainStores);
    public method = new AudioMethod(this.stores, this.events);
    public commands = [
      new CreateCommand(this.stores, this.events),
      new DestroyCommand(this.stores, this.events),
      new TransferCommand(this.stores, this.events),
      new SetAttributesCommand(this.stores, this.events),
    ];
    private _collectionMethod!: CollectionMethod;

    public constructor() {
      super();
      this.stores.register(AudioAccountStore, new AudioAccountStore(this.name));
      this.stores.register(AudioStore, new AudioStore(this.name));
      this.events.register(CreateEvent, new CreateEvent(this.name));
    }

    public addDependencies(collectionMethod: CollectionMethod) {
      this._collectionMethod = collectionMethod;
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
    public async afterCommandExecute(context: TransactionExecuteContext): Promise<void> {
      const account = await this.stores.get(AudioAccountStore).get(context, context.transaction.senderAddress);
      const audioID = account.audio.audios[account.audio.audios.length -1];
      const { collectionID } = await this.stores.get(AudioStore).get(context, audioID);

      if (context.transaction.command === 'create') {
        await this._collectionMethod.addAudio(
          context.getMethodContext(),
          audioID,
          collectionID,
          context.transaction.senderAddress,
        );
      }
    }

  // public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

  // public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {}

  // public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {}
}
