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
import { LoyaltyOwner, ReclaimCommandParams, ClaimData } from '../types';
import { AudioIncomeReclaimed } from '../events/audioIncomeReclaimed';

export class ReclaimCommand extends BaseCommand {
  public schema = reclaimCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    _context: CommandVerifyContext<ReclaimCommandParams>,
  ): Promise<VerificationResult> {
    // @todo should we validate that the params are empty?
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

    // Get account
    const senderAccount = await audioAccountStore.get(context, senderAddress);
    if (senderAccount.audio.audios.length === 0) {
      throw new Error('You do not own any audio.');
    }

    const claimData: ClaimData = {
      audioIDs: [],
      totalClaimed: BigInt(0),
    }

    // For each audio, add the income to the total income,
    // and set the income to 0 for the owner = senderAddress
    for (const audioID of senderAccount.audio.audios) {
      const audioNFT = await audioStore.get(context, audioID);
      const newOwnersList: LoyaltyOwner[] = [];
      audioNFT.owners.forEach((ownerInfo) => {
        if (ownerInfo.address.equals(senderAddress)) {
          claimData.audioIDs.push(audioID);
          claimData.totalClaimed += ownerInfo.income;
          newOwnersList.push({
            ...ownerInfo,
            income: BigInt(0),
          });
        } else {
          newOwnersList.push(ownerInfo);
        }
      });
      audioNFT.owners = newOwnersList;
      // Update audio on the blockchain
      await audioStore.set(context, audioID, audioNFT);
    }
    // Transfer the total income from treasury account to the senderAddress
    await this._tokenMethod.transfer(
      methodContext,
      TREASURY_ADDRESS,
      senderAddress,
      tokenID,
      claimData.totalClaimed,
    );
    // Emit a "Income Reclaimed" event
    const audioIncomeReclaimed = this.events.get(AudioIncomeReclaimed);
    audioIncomeReclaimed.add(context, {
      address: context.transaction.senderAddress,
      claimData,
    }, [context.transaction.senderAddress]);
  }
}
