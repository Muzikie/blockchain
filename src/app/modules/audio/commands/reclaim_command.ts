/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
  TokenMethod,
} from 'lisk-sdk';
import { TREASURY_ADDRESS } from '../../subscription/constants';
import { AudioStore } from '../stores/audio';
import { AudioAccountStore } from '../stores/audioAccount';
import { reclaimCommandParamsSchema } from '../schemas';
import { LoyaltyOwner, ReclaimCommandParams } from '../types';

export class ReclaimCommand extends BaseCommand {
  public schema = reclaimCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(_context: CommandVerifyContext<ReclaimCommandParams>): Promise<VerificationResult> {
    // const { transaction } = context;

    // if (transaction.params.length !== 0) {
    //   return {
    //     status: VerifyStatus.FAIL,
    //     error: new Error('Reclaim transaction params must be empty.'),
    //   };
    // }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<ReclaimCommandParams>): Promise<void> {
    const {
      transaction: { senderAddress },
      chainID,
      getMethodContext,
    } = context;
    const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
    const methodContext = getMethodContext();
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
    await this._tokenMethod.transfer(
      methodContext,
      TREASURY_ADDRESS,
      senderAddress,
      tokenID,
      totalIncome,
    );
  }
}
