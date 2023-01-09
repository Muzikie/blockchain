/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { destroyCommandParamsSchema } from '../schemas';
import { DestroyCommandParams } from '../types';
import { CollectionAccountStore } from '../stores/collectionAccount';
import { CollectionStore } from '../stores/collection';

export class DestroyCommand extends BaseCommand {
  public schema = destroyCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    _context: CommandVerifyContext<DestroyCommandParams>,
  ): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<DestroyCommandParams>): Promise<void> {
    const { params, transaction } = context;
    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    const collectionSubStore = this.stores.get(CollectionStore);

    // Get the collection object from the blockchain
    const collectionExists = await collectionSubStore.has(context, params.collectionID);
    if (!collectionExists) {
      throw new Error('Collection does not exist.');
    }

    const collection = await collectionSubStore.get(context, params.collectionID);

    // No orphan audios left behind
    if (collection.audios.length) {
      throw new Error('Remove the audios first.');
    }

    // Check if the sender owns the collection
    if (!collection.creatorAddress.equals(transaction.senderAddress)) {
      throw new Error('You cannot destroy an collection that you do not own.');
    }

    // Delete the collection object from the blockchain
    await collectionSubStore.del(context, params.collectionID);

    // Delete the collection ID from the sender account
    const collectionAccount = await collectionAccountSubStore.get(
      context,
      transaction.senderAddress,
    );
    const collectionIndex = collectionAccount.collection.collections.findIndex(id =>
      id.equals(params.collectionID),
    );
    collectionAccount.collection.collections.splice(collectionIndex, 1);
    await collectionAccountSubStore.set(context, transaction.senderAddress, collectionAccount);
  }
}
