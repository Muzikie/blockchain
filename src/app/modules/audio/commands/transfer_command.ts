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
import { TransferCommandParams, AudioAccount } from '../types';
import { transferCommandParamsSchema } from '../schemas';

export class TransferCommand extends BaseCommand {
  public schema = transferCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<TransferCommandParams>): Promise<VerificationResult> {
    const { address, audioID } = context.params;
    if (!Buffer.isBuffer(address)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Parameter recipientAddress must be a buffer.')
      }
    }

    if (!Buffer.isBuffer(audioID)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Parameter audioID must be a buffer.')
      }
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<TransferCommandParams>): Promise<void> {
    const audioAccountSubStore = this.stores.get(AudioAccountStore);
    const audioSubStore = this.stores.get(AudioStore);

    // Get audio NFT and both accounts from substores
    const { address, audioID } = context.params;
    const audioExists = await audioSubStore.has(context, audioID);

    if (!audioExists) {
      throw new Error('Audio NFT does not exist.');
    }

    const audioNFT = await audioSubStore.get(context, audioID);

    if (!audioNFT.ownerAddress.equals(context.transaction.senderAddress)) {
      throw new Error('You are not the owner of this audio.');
    }

    const audioAccount = await audioAccountSubStore.get(context, audioNFT.ownerAddress);
    const recipientExists = await audioAccountSubStore.has(context, address);

    // Find and remove the audioID from the owner account
    const audioIndex = audioAccount.audio.audios.findIndex(id => id.equals(audioID));
    if (audioIndex === -1) {
      throw new Error('Audio not found in the sender account.');
    }
    audioAccount.audio.audios.splice(audioIndex, 1);

    // Add the audioID to the recipient account
    audioNFT.ownerAddress = address;
    if (recipientExists) {
      const recipientAccount = await audioAccountSubStore.get(context, address);
      recipientAccount.audio.audios.push(audioID);
      await audioAccountSubStore.set(context, address, recipientAccount);
    } else {
      const recipientAccount: AudioAccount = {
        audio: {
          audios: [audioID],
        }
      };
      await audioAccountSubStore.set(context, address, recipientAccount);
    }

    // Update the sender account on the blockchain
    await audioAccountSubStore.set(context, context.transaction.senderAddress, audioAccount);
    // Update the NFT token on the blockchain
    await audioSubStore.set(context, audioID, audioNFT);
  }
}
