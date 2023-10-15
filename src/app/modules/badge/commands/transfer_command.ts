/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { BadgeStore } from '../stores/badge';
import { BadgeAccountStore } from '../stores/badgeAccount';
import { TransferCommandParams, BadgeAccount } from '../types';
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
    const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
    const badgeSubStore = this.stores.get(BadgeStore);

    // Get badge NFT and both accounts from substores
    const { address, badgeID, shares } = context.params;
    const { senderAddress } = context.transaction;
    const badgeExists = await badgeSubStore.has(context, badgeID);

    if (!badgeExists) {
      throw new Error('Badge NFT does not exist.');
    }

    const badgeNFT = await badgeSubStore.get(context, badgeID);
    const senderShare = badgeNFT.owners.find(item => item.address.equals(senderAddress));

    if (!senderShare) {
      throw new Error('You do not own share of this badge.');
    }

    if (senderShare.shares < shares) {
      throw new Error(`You may only transfer ${senderShare.shares} shares (your shares)`);
    }

    const recipientExists = await badgeAccountSubStore.has(context, address);
    let oldIncome = BigInt(0);

    // set old owner shares = old shares - context.params.shares
    badgeNFT.owners = badgeNFT.owners
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

    // if old owner shares = 0, remove badge ID from old owner's ownedBadge array
    const senderAccount = await badgeAccountSubStore.get(context, senderAddress);
    if (senderShare.shares === shares) {
      senderAccount.badge.badges = senderAccount.badge.badges.filter(item => !item.equals(badgeID));
      // update badge account in badgeAccountSubStore
      await badgeAccountSubStore.set(context, senderAddress, senderAccount);
    }

    // set new owner shares = context.params.shares
    let recipientAccount: BadgeAccount;
    if (recipientExists) {
      recipientAccount = await badgeAccountSubStore.get(context, address);
      if (!recipientAccount.badge.badges.find(item => item.equals(badgeID))) {
        recipientAccount.badge.badges.push(badgeID);
      }
    } else {
      recipientAccount = {
        badge: {
          badges: [badgeID],
        },
      };
    }
    await badgeAccountSubStore.set(context, address, recipientAccount);

    const recipientIndex = badgeNFT.owners.findIndex(item => item.address.equals(address));
    if (recipientIndex === -1) {
      // if recipient does not exist, add new owner to owners array
      badgeNFT.owners.push({
        address,
        shares,
        income: senderShare.shares === shares ? oldIncome : BigInt(0), // income is 0 for new owners
      });
    } else {
      // if recipient exists, add new owner shares to recipient shares
      badgeNFT.owners[recipientIndex].shares += shares;
    }

    // update badge NFT in badgeSubStore
    await badgeSubStore.set(context, badgeID, badgeNFT);
  }
}
