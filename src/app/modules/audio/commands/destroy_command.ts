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
import { AudioAccountStore } from '../stores/audioAccount';
import { AudioStore } from '../stores/audio';

export class DestroyCommand extends BaseCommand {
  public schema = destroyCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(_context: CommandVerifyContext<DestroyCommandParams>): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<DestroyCommandParams>): Promise<void> {
    const { params, transaction } = context;
    const audioAccountSubStore = this.stores.get(AudioAccountStore);
    const audioSubStore = this.stores.get(AudioStore);

    // Get the audio object from the blockchain
    const audioExists = await audioSubStore.has(context, params.audioID);
    if (!audioExists) {
      throw new Error('Audio does not exist.');
    }

    const audio = await audioSubStore.get(context, params.audioID);

    // Check if the sender owns loyalty rights of the audio
    const senderShare = audio.owners.find(item => item.address.equals(transaction.senderAddress));
    if (senderShare?.shares !== 100) {
      throw new Error('You can only destroy an audio if you own 100% of the shares.');
    }

    // Throw an error if the audio has non-zero income

    // Delete the audio object from the blockchain
    await audioSubStore.del(context, params.audioID);

    // Delete the audio ID from the sender account
    const audioAccount = await audioAccountSubStore.get(context, transaction.senderAddress);
    const audioIndex = audioAccount.audio.audios.findIndex((id) => id.equals(params.audioID));
    audioAccount.audio.audios.splice(audioIndex, 1);
    await audioAccountSubStore.set(context, transaction.senderAddress, audioAccount);
  }
}
