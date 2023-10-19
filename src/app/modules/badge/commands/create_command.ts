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
import { CreateCommandParams, Badge, BadgeAccount } from '../types';
import { createCommandParamsSchema } from '../schemas';
import { TREASURY_ADDRESS } from '../../../constants';
import { BadgeCreated } from '../events/badgeCreated';

const getBadgeID = (params: CreateCommandParams) =>
  Buffer.concat([
    Buffer.from(params.type, 'utf8'),
    Buffer.from(params.rank.toString(), 'utf8'),
    Buffer.from(params.awardDate, 'utf8')],
  );

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<CreateCommandParams>,
  ): Promise<VerificationResult> {
    const { transaction, params } = context;

    const badgeSubStore = this.stores.get(BadgeStore);

    if (!transaction.senderAddress.equals(TREASURY_ADDRESS)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('You are not authorized to create a anchor.'),
      };
    }

    // Ensure that there's only one badge (of each type) per day
    const badgeID = getBadgeID(params);
    const badgeExists = await badgeSubStore.has(context, badgeID);
    if (badgeExists) {
      throw new Error('You have already created this badge.');
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the badge file
    const badgeID = getBadgeID(params);

    const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
    const badgeSubStore = this.stores.get(BadgeStore);

    // Create Badge NFT
    const badgeNFT: Badge = {
      ...params,
      badgeID,
      prize: BigInt(0), // @todo calculate prize for the rank
      claimed: false,
    };

    // Store the hash of the badge object in the sender account
    const accountExists = await badgeAccountSubStore.has(context, transaction.senderAddress);
    if (accountExists) {
      const senderAccount: BadgeAccount = await badgeAccountSubStore.get(
        context,
        transaction.senderAddress,
      );
      senderAccount.badges = [...senderAccount.badges, badgeID];
      await badgeAccountSubStore.set(context, transaction.senderAddress, senderAccount);
    } else {
      await badgeAccountSubStore.set(context, context.transaction.senderAddress, {
        badges: [badgeID],
      });
    }

    // Store the badge object in the blockchain
    await badgeSubStore.set(context, badgeID, badgeNFT);

    // Emit a "New collection" event
    const badgeCreated = this.events.get(BadgeCreated);
    badgeCreated.add(context, {
      badgeID,
      prize: BigInt(0),
    }, [context.transaction.senderAddress]);
  }
}
