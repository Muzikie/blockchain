/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AudioStore } from '../stores/audio';
import { setAttributeCommandParamsSchema } from '../schemas';
import { SetAttributeCommandParams, Audio } from '../types';
import { validGenres } from '../constants';

export class SetAttributeCommand extends BaseCommand {
  public schema = setAttributeCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<SetAttributeCommandParams>): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    const numericYear = Number(context.params.releaseYear);
    if (numericYear < 1900 || numericYear > thisYear) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error(`Release year must be a number between 1900 and ${thisYear}`)
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

  public async execute(context: CommandExecuteContext<SetAttributeCommandParams>): Promise<void> {
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
    if (!audioNFT.ownerAddress.equals(transaction.senderAddress)) {
      throw new Error('You cannot update an audio that you do not own.');
    }

    // Create the Audio object and save it on the blockchain
    const updatedObject: Audio = {
      ...params,
      ownerAddress: audioNFT.ownerAddress,
    };
    await audioSubStore.set(context,  params.audioID, updatedObject);
  }
}
