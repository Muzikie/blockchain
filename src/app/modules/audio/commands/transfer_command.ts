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
  public async verify(
    _context: CommandVerifyContext<TransferCommandParams>,
  ): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<TransferCommandParams>): Promise<void> {
    const audioAccountSubStore = this.stores.get(AudioAccountStore);
    const audioSubStore = this.stores.get(AudioStore);

    // Get audio NFT and both accounts from substores
    const { address, audioID, shares } = context.params;
    const { senderAddress } = context.transaction;
    const audioExists = await audioSubStore.has(context, audioID);

    if (!audioExists) {
      throw new Error('Audio NFT does not exist.');
    }

    const audioNFT = await audioSubStore.get(context, audioID);
    const senderShare = audioNFT.owners.find(item => item.address.equals(senderAddress));

    if (!senderShare) {
      throw new Error('You do not own share of this audio.');
    }

    if (senderShare.shares < shares) {
      throw new Error(`You may only transfer 1-${senderShare.shares} shares (your shares)`);
    }

    const audioCreator = await audioAccountSubStore.get(context, audioNFT.creatorAddress);
    const recipientExists = await audioAccountSubStore.has(context, address);
    let oldIncome = BigInt(0);

    // set old owner shares = old shares - context.params.shares
    audioNFT.owners = audioNFT.owners
      .map(item => {
        if (item.address.equals(senderAddress)) {
          oldIncome = item.income;
          return {
            ...item,
            shares: item.shares - shares,
          };
        }
        return item;
      })
      // if old owner shares = 0, remove old owner from owners array
      .filter(item => item.shares > 0);

    // if old owner shares = 0, remove audio ID from old owner's ownedAudio array
    if (senderShare.shares === shares) {
      audioCreator.audio.audios = audioCreator.audio.audios.filter(item => !item.equals(audioID));
    }
    // set new owner shares = context.params.shares
    let recipientAccount: AudioAccount;
    if (recipientExists) {
      recipientAccount = await audioAccountSubStore.get(context, address);
      if (!recipientAccount.audio.audios.find(item => item.equals(audioID))) {
        recipientAccount.audio.audios.push(audioID);
      }
    } else {
      recipientAccount = {
        audio: {
          audios: [audioID],
        },
      };
    }
    await audioAccountSubStore.set(context, address, recipientAccount);

    const recipientIndex = audioNFT.owners.findIndex(item => item.address.equals(address));
    if (recipientIndex === -1) {
      // if recipient does not exist, add new owner to owners array
      audioNFT.owners.push({
        address,
        shares,
        income: senderShare.shares === shares ? BigInt(0) : oldIncome, // income is 0 for new owners
      });
    } else {
      // if recipient exists, add new owner shares to recipient shares
      audioNFT.owners[recipientIndex].shares += shares;
    }

    // update audio NFT in audioSubStore
    await audioSubStore.set(context, audioID, audioNFT);
    // update audio account in audioAccountSubStore
    await audioAccountSubStore.set(context, senderAddress, audioCreator);
  }
}
