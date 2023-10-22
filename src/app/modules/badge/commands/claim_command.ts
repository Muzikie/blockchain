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
import { BadgeStore } from '../stores/badge';
import { claimCommandParamsSchema } from '../schemas';
import { ClaimCommandParams } from '../types';
import { TREASURY_ADDRESS } from '../../../constants';
import { CONTRIBUTION_FEE } from '../../anchor/constants';
import { BADGE_PRIZE_PERCENTAGE } from '../constants';
import { AnchorMethod } from '../../anchor/method';

export class ClaimCommand extends BaseCommand {
  public schema = claimCommandParamsSchema;
  private _tokenMethod!: TokenMethod;
  private _anchorMethod!: AnchorMethod;

  public addDependencies(tokenMethod: TokenMethod, anchorMethod: AnchorMethod) {
    this._tokenMethod = tokenMethod;
    this._anchorMethod = anchorMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<ClaimCommandParams>,
  ): Promise<VerificationResult> {
    const { transaction, params } = context;
    // Only the owner of the assigned anchor can claim the badge
    const badgeStore = this.stores.get(BadgeStore);
    const badgeNFT = await badgeStore.get(context, params.badgeID);

    if (!badgeNFT.awardedTo.equals(transaction.senderAddress)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('You are not authorized to claim this badge.'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<ClaimCommandParams>): Promise<void> {
    const {
      transaction: { senderAddress },
      params: { badgeID },
      chainID,
      getMethodContext,
    } = context;
    const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
    const methodContext = getMethodContext();
    const badgeStore = this.stores.get(BadgeStore);

    // calculate the prize based on the anchor's contribution and the badge rank
    const badgeNFT = await badgeStore.get(context, badgeID);
    
    const votesCount = await this._anchorMethod.getVoteCounts(methodContext, badgeNFT.awardDate);
    
    const prize = (BigInt(votesCount) * CONTRIBUTION_FEE * BADGE_PRIZE_PERCENTAGE[badgeNFT.rank - 1]) / BigInt(100);
    // update prize and set claimed to true
    const updateBadge  = {
      ...badgeNFT,
      prize,
      claimed: true,
    }; 

    await badgeStore.set(context, badgeID, updateBadge);

    // Transfer the prize
    await this._tokenMethod.transfer(
      methodContext,
      TREASURY_ADDRESS,
      senderAddress,
      tokenID,
      prize,
    );
  }
}
