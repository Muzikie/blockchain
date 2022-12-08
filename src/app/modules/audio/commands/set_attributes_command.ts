/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AudioStore } from '../stores/audio';
import { setAttributesCommandParamsSchema } from '../schemas';
import { SetAttributesCommandParams, Audio } from '../types';
import { validGenres, MIN_RELEASE_YEAR } from '../constants';

export class SetAttributesCommand extends BaseCommand {
  public schema = setAttributesCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<SetAttributesCommandParams>): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    const numericYear = Number(context.params.releaseYear);
    if (numericYear < MIN_RELEASE_YEAR || numericYear > thisYear) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error(`Release year must be a number between ${MIN_RELEASE_YEAR} and ${thisYear}`)
      }
    }
    if (context.params.genre.some(item => item > validGenres.length)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Genres should be selected from the list of valid genres')
      }
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<SetAttributesCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the audio file

    const audioSubStore = this.stores.get(AudioStore);

    // Check uniqueness of the NFT
    const audioExists = await audioSubStore.has(context, params.audioID);
    if (!audioExists) {
      throw new Error('Audio with this ID does not exist.');
    }

    const audioNFT: Audio = await audioSubStore.get(context, params.audioID);

    // Check if the sender owns the audio
    if (!audioNFT.creatorAddress.equals(transaction.senderAddress)) {
      throw new Error('You cannot update an audio that you do not own.');
    }

    // Create the Audio object and save it on the blockchain
    const updatedObject: Audio = {
      ...params,
      // set income back
      owners: audioNFT.owners,
      creatorAddress: audioNFT.creatorAddress,
    };
    await audioSubStore.set(context,  params.audioID, updatedObject);
  }
}
