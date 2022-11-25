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
import { CreateCommandParams } from '../types';
import { createCommandParamsSchema } from '../schemas';
import { validGenres } from '../constants';
import { getNodeForName } from '../utils';

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<CreateCommandParams>): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    if (context.params.releaseYear < 1900 || context.params.releaseYear > thisYear) {
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
    // @todo Here we should check if the Audio is already uploaded using steganography methods

    // Create the Audio object and save it on the blockchain
    const audioObject = {
      name: params.name,
      releaseYear: params.releaseYear,
      artistName: params.artistName,
      genre: params.genre,
      ownerAddress: transaction.senderAddress,
    };

    // Store the audio object in the blockchain
    await audioSubStore.set(context, key, audioObject);

    // Store the hash of the audio object in the sender account
    const accountExists = await audioAccountSubStore.has(context, transaction.senderAddress);
    if (accountExists) {
      const senderAccount = await audioAccountSubStore.get(context, transaction.senderAddress);
      senderAccount.audios = [...senderAccount.audios, key];
      await audioAccountSubStore.set(context, transaction.senderAddress, senderAccount);
    } else {
      await audioAccountSubStore.set(context, context.transaction.senderAddress, {
        audios: [key]
      });
    }
  }
}
