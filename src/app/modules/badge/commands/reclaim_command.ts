/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
  TokenMethod,
} from 'lisk-sdk';
import { TREASURY_ADDRESS } from '../../anchor/constants';
import { BadgeStore } from '../stores/badge';
import { BadgeAccountStore } from '../stores/badgeAccount';
import { reclaimCommandParamsSchema } from '../schemas';
import { LoyaltyOwner, ReclaimCommandParams, ClaimData } from '../types';
import { BadgeIncomeReclaimed } from '../events/badgeIncomeReclaimed';

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
    const badgeStore = this.stores.get(BadgeStore);
    const badgeAccountStore = this.stores.get(BadgeAccountStore);

    // Get account
    const senderAccount = await badgeAccountStore.get(context, senderAddress);
    if (senderAccount.badge.badges.length === 0) {
      throw new Error('You do not own any badge.');
    }

    const claimData: ClaimData = {
      badgeIDs: [],
      totalClaimed: BigInt(0),
    }

    // For each badge, add the income to the total income,
    // and set the income to 0 for the owner = senderAddress
    for (const badgeID of senderAccount.badge.badges) {
      const badgeNFT = await badgeStore.get(context, badgeID);
      const newOwnersList: LoyaltyOwner[] = [];
      badgeNFT.owners.forEach((ownerInfo) => {
        if (ownerInfo.address.equals(senderAddress)) {
          claimData.badgeIDs.push(badgeID);
          claimData.totalClaimed += ownerInfo.income;
          newOwnersList.push({
            ...ownerInfo,
            income: BigInt(0),
          });
        } else {
          newOwnersList.push(ownerInfo);
        }
      });
      badgeNFT.owners = newOwnersList;
      // Update badge on the blockchain
      await badgeStore.set(context, badgeID, badgeNFT);
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
    const badgeIncomeReclaimed = this.events.get(BadgeIncomeReclaimed);
    badgeIncomeReclaimed.add(context, {
      address: context.transaction.senderAddress,
      claimData,
    }, [context.transaction.senderAddress]);
  }
}
