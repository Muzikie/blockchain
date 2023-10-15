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

const getAnchorID = (params: CreateCommandParams): Buffer =>
  Buffer.concat([Buffer.from(params.spotifyId, 'utf8')]);

const getCreatedAt = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<CreateCommandParams>,
  ): Promise<VerificationResult> {
    const anchorStore = this.stores.get(AnchorStore);
    const anchorID = getAnchorID(context.params);
    const anchorExists = await anchorStore.has(context, anchorID);
    if (anchorExists) {
      throw new Error('This anchor already exist.');
    }

    // @todo Add submission rate limit

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const {
      params,
      transaction: { senderAddress },
    } = context;
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorStore = this.stores.get(AnchorStore);

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

    const anchorCreated = this.events.get(AnchorCreated);
    anchorCreated.add(context, {
      submitter: context.transaction.senderAddress,
      anchorID,
      createdAt,
    }, [context.transaction.senderAddress]);
  }
}
