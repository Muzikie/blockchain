/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AnchorStore } from '../stores/anchor';
import { AnchorAccountStore } from '../stores/anchorAccount';
import { AnchorCreated } from '../events/anchorCreated';
import { CreateCommandParams, Anchor, AnchorAccount } from '../types';
import { createCommandParamsSchema } from '../schemas';
import { getCreatedAt, getAnchorID } from '../utils';
import { VOTE_RATE_LIMIT } from '../constants';
import { BadgeMethod } from '../../badge/method';

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;
  private _badgeMethod!: BadgeMethod;

  public addDependencies(badgeMethod: BadgeMethod) {
    this._badgeMethod = badgeMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<CreateCommandParams>,
  ): Promise<VerificationResult> {
    const anchorStore = this.stores.get(AnchorStore);
    const { senderAddress } = context.transaction;
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorId = getAnchorID(context.params);

    const anchorExists = await anchorStore.has(context, anchorId);
    if (anchorExists) {
      throw new Error('This anchor already exist.');
    }

    // Add submission rate limit
    const senderExists = await anchorAccountStore.has(context, senderAddress);
    if(senderExists) {
      const senderAccount = await anchorAccountStore.get(context, senderAddress);
      const IDS = senderAccount.anchors.slice(-1 * VOTE_RATE_LIMIT);

      if(IDS.length >= VOTE_RATE_LIMIT) {
        const anchor = await anchorStore.get(context, IDS[0]);

        if (anchor.createdAt === getCreatedAt(Math.floor(((new Date()).getTime())))) {
          throw new Error(`You have exceeded the ${VOTE_RATE_LIMIT} anchor submissions daily limit.`);
        }
      }
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const {
      params,
      transaction: { senderAddress },
    } = context;
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorStore = this.stores.get(AnchorStore);
    const methodContext = context.getMethodContext();

    // Create anchor ID
    const anchorID = getAnchorID(context.params);
    const createdAt = getCreatedAt(new Date().getTime());
    // Create anchor object
    const anchor: Anchor = {
      ...params,
      id: anchorID,
      createdAt,
      votes: [],
      submitter: senderAddress,
    };

    // Store the anchor object in the blockchain
    await anchorStore.set(context, anchorID, anchor);

    // Get the sender account from the blockchain
    const senderExists = await anchorAccountStore.has(context, senderAddress);
    let senderAccount: AnchorAccount;
    if (!senderExists) {
      senderAccount = {
        anchors: [anchorID],
        votes: [],
      };
    } else {
      const retrievedAccount = await anchorAccountStore.get(context, senderAddress);
      senderAccount = {
        anchors: [...retrievedAccount.anchors, anchorID],
        votes: retrievedAccount.votes
      };
    }

    // Store the account object in the blockchain
    await anchorAccountStore.set(context, senderAddress, senderAccount);

    await this._badgeMethod.createBadgesForDay(methodContext, createdAt);

    const anchorCreated = this.events.get(AnchorCreated);
    anchorCreated.add(context, {
      submitter: context.transaction.senderAddress,
      anchorID,
      createdAt,
    }, [context.transaction.senderAddress]);
  }
}
