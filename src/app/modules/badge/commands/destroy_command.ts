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
import { BadgeAccountStore } from '../stores/badgeAccount';
import { BadgeStore } from '../stores/badge';

export class DestroyCommand extends BaseCommand {
  public schema = destroyCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    _context: CommandVerifyContext<DestroyCommandParams>,
  ): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<DestroyCommandParams>): Promise<void> {
    const { params, transaction } = context;
    const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
    const badgeSubStore = this.stores.get(BadgeStore);

    // Get the badge object from the blockchain
    const badgeExists = await badgeSubStore.has(context, params.badgeID);
    if (!badgeExists) {
      throw new Error('Badge does not exist.');
    }

    const badge = await badgeSubStore.get(context, params.badgeID);

    // Check if the sender owns loyalty rights of the badge
    const sender = badge.owners.find(item => item.address.equals(transaction.senderAddress));
    if (sender?.shares !== 100) {
      throw new Error('You can only destroy an badge if you own 100% of the shares.');
    }

    // Throw an error if the badge has non-zero income
    if (sender?.income !== BigInt(0)) {
      throw new Error('Claim the income before destroying the badge.');
    }

    // Delete the badge object from the blockchain
    await badgeSubStore.del(context, params.badgeID);

    // Delete the badge ID from the sender account
    const badgeAccount = await badgeAccountSubStore.get(context, transaction.senderAddress);
    const badgeIndex = badgeAccount.badge.badges.findIndex(id => id.equals(params.badgeID));
    badgeAccount.badge.badges.splice(badgeIndex, 1);
    await badgeAccountSubStore.set(context, transaction.senderAddress, badgeAccount);
  }
}
