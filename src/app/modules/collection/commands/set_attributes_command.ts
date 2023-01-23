/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { CollectionStore } from '../stores/collection';
import { setAttributesCommandParamsSchema } from '../schemas';
import { SetAttributesCommandParams, Collection } from '../types';
import { validCollectionTypes, MIN_RELEASE_YEAR } from '../constants';

export class SetAttributesCommand extends BaseCommand {
  public schema = setAttributesCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<SetAttributesCommandParams>,
  ): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    const numericYear = Number(context.params.releaseYear);
    if (numericYear < MIN_RELEASE_YEAR || numericYear > thisYear) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error(
          `Release year must be a number between ${MIN_RELEASE_YEAR} and ${thisYear}`,
        ),
      };
    }
    if (!validCollectionTypes.includes(context.params.collectionType)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Type should be selected from the list of valid types'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<SetAttributesCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the collection file

    const collectionSubStore = this.stores.get(CollectionStore);

    // Check uniqueness of the NFT
    const collectionExists = await collectionSubStore.has(context, params.collectionID);
    if (!collectionExists) {
      throw new Error('Collection with this ID does not exist.');
    }

    const collectionNFT: Collection = await collectionSubStore.get(context, params.collectionID);

    // Check if the sender owns the collection
    if (!collectionNFT.creatorAddress.equals(transaction.senderAddress)) {
      throw new Error('You cannot update an collection that you do not own.');
    }

    // Create the Collection object and save it on the blockchain
    // Note: You can not change the list of audios using this method
    // Audios of a collection can be changes from the audio module
    const updatedObject: Collection = {
      ...params,
      coverSignature: collectionNFT.coverSignature,
      coverHash: collectionNFT.coverHash,
      audios: collectionNFT.audios,
      creatorAddress: collectionNFT.creatorAddress,
    };
    await collectionSubStore.set(context, params.collectionID, updatedObject);
  }
}
