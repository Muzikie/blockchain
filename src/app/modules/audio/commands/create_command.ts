/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AudioStore } from '../stores/audio';
import { AudioAccountStore } from '../stores/audioAccount';
import { CreateCommandParams, Audio, AudioAccount } from '../types';
import { createCommandParamsSchema } from '../schemas';
import { validGenres } from '../constants';
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
    if (context.params.genre.some(item => item > validGenres.length)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Genres should be selected from the list of valid genres')
      }
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the audio file
    const key = getNodeForName(params);

    const audioAccountSubStore = this.stores.get(AudioAccountStore);
    const audioSubStore = this.stores.get(AudioStore);

    // Check uniqueness of the NFT
    const audioExists = await audioSubStore.has(context, key);
    if (audioExists) {
      throw new Error('You have already created this audio.');
    }

    // Create the Audio object and save it on the blockchain
    const audioObject: Audio = {
      ...params,
      ownerAddress: transaction.senderAddress,
    };

    // Store the hash of the audio object in the sender account
    const accountExists = await audioAccountSubStore.has(context, transaction.senderAddress);
    if (accountExists) {
      const senderAccount: AudioAccount = await audioAccountSubStore.get(context, transaction.senderAddress);
      senderAccount.audio.audios = [...senderAccount.audio.audios, key];
      await audioAccountSubStore.set(context, transaction.senderAddress, senderAccount);
    } else {
      await audioAccountSubStore.set(context, context.transaction.senderAddress, {
        audio: {
          audios: [key],
        }
      });
    }

    // @todo Here we should check if the Audio is already uploaded using steganography methods
    // Store the audio object in the blockchain
    await audioSubStore.set(context, key, audioObject);
  }
}
