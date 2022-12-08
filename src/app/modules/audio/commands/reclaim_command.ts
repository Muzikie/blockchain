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
import { AudioAccount, Audio, LoyaltyOwner } from '../types';

export class ReclaimCommand extends BaseCommand {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext): Promise<VerificationResult> {
    const { transaction } = context;

    if (transaction.params.length !== 0) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Reclaim transaction params must be empty.'),
      };
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext): Promise<void> {
    const {
      transaction: { senderAddress },
      getMethodContext,
    } = context;
    const audioStore = this.stores.get(AudioStore);
    const audioAccountStore = this.stores.get(AudioAccountStore);

    let totalIncome = BigInt(0);

    // Get account
    const senderAccount = await audioAccountStore.get(context, senderAddress);
    if (senderAccount.audio.audios.length === 0) {
      throw new Error('You do not own any audio.');
    }

    const collectIncome =  (item: LoyaltyOwner) => {
      if (item.address.equals(senderAddress)) {
        totalIncome += item.income;
        return {
          ...item,
          income: BigInt(0),
        };
      }
      return item;
    };

    // For each audio, add the income to the total income,
    // and set the income to 0 for the owner = senderAddress
    for (const audioID of senderAccount.audio.audios) {
      const audioNFT = await audioStore.get(context, audioID);
      audioNFT.owners = audioNFT.owners.map(collectIncome);
      // Update audio on the blockchain
      await audioStore.set(context, audioID, audioNFT);
    }
    // @todo Transfer the total income from treasury account to the senderAddress
    context.logger.info(':: ReclaimCommand: totalIncome: ', totalIncome.toString());
  }
}
