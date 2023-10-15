/* eslint-disable @typescript-eslint/member-ordering */
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
import { TREASURY_ADDRESS } from '../../../constants';
import { BadgeAccountStore } from '../stores/badgeAccount';
import { BadgeStore } from '../stores/badge';

export class DestroyCommand extends BaseCommand {
  public schema = destroyCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<DestroyCommandParams>,
  ): Promise<VerificationResult> {
    const { params, transaction } = context;
    const badgeSubStore = this.stores.get(BadgeStore);

    if (transaction.senderAddress !== TREASURY_ADDRESS) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('You are not authorized to destroy an badge.'),
      };
    }

    // Get the badge object from the blockchain
    const badgeExists = await badgeSubStore.has(context, params.badgeID);
    if (!badgeExists) {
      throw new Error('Badge does not exist.');
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<DestroyCommandParams>): Promise<void> {
    const { params, transaction } = context;
    const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
    const badgeSubStore = this.stores.get(BadgeStore);

    // Delete the badge object from the blockchain
    await badgeSubStore.del(context, params.badgeID);

    // Delete the badge ID from the sender account
    const badgeAccount = await badgeAccountSubStore.get(context, transaction.senderAddress);
    const badgeIndex = badgeAccount.badges.findIndex(id => id.equals(params.badgeID));
    badgeAccount.badges.splice(badgeIndex, 1);
    await badgeAccountSubStore.set(context, transaction.senderAddress, badgeAccount);
  }
}
