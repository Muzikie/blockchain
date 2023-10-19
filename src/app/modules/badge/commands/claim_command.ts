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

export class ClaimCommand extends BaseCommand {
  public schema = claimCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
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

    // Set the claimed flag to true
    const badgeNFT = await badgeStore.get(context, badgeID);
    badgeNFT.claimed = true;
    await badgeStore.set(context, badgeID, badgeNFT);

    // Transfer the prize
    await this._tokenMethod.transfer(
      methodContext,
      TREASURY_ADDRESS,
      senderAddress,
      tokenID,
      badgeNFT.prize,
    );
  }
}
