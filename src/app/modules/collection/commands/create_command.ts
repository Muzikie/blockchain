/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { CollectionStore } from '../stores/collection';
import { CollectionAccountStore } from '../stores/collectionAccount';
import { CreateCommandParams, Collection, CollectionAccount } from '../types';
import { createCommandParamsSchema } from '../schemas';
import { validCollectionTypes } from '../constants';
import { getNodeForName } from '../utils';

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<CreateCommandParams>): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    const numericYear = Number(context.params.releaseYear);
    if (numericYear < 1900 || numericYear > thisYear) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error(`Release year must be a number between 1900 and ${thisYear}`)
      }
    }
    if (!validCollectionTypes.includes(context.params.collectionType)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Collection type should be selected from the list of valid types')
      }
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the audio file
    const key = getNodeForName(params);

    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    const collectionSubStore = this.stores.get(CollectionStore);

    // Check uniqueness of the NFT
    const collectionExists = await collectionSubStore.has(context, key);
    if (collectionExists) {
      throw new Error('You have already created this audio.');
    }

    // Create the Collection object and save it on the blockchain
    const audioObject: Collection = {
      ...params,
      ownerAddress: transaction.senderAddress,
    };

    // Store the hash of the audio object in the sender account
    const accountExists = await collectionAccountSubStore.has(context, transaction.senderAddress);
    if (accountExists) {
      const senderAccount: CollectionAccount = await collectionAccountSubStore.get(context, transaction.senderAddress);
      senderAccount.collection.collections = [...senderAccount.collection.collections, key];
      await collectionAccountSubStore.set(context, transaction.senderAddress, senderAccount);
    } else {
      await collectionAccountSubStore.set(context, context.transaction.senderAddress, {
        collection: {
          collections: [key],
        }
      });
    }

    // Store the collection object in the blockchain
    await collectionSubStore.set(context, key, audioObject);
  }
}
