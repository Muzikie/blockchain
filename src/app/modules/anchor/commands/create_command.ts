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
import { DEV_ADDRESS } from '../constants';
import { getEntityID } from '../../../utils';

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<CreateCommandParams>,
  ): Promise<VerificationResult> {
    if (!context.transaction.senderAddress.equals(DEV_ADDRESS)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('You are not authorized to create a anchor.'),
      };
    }
    if (context.params.maxMembers === 0 || context.params.maxMembers > 5) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Max members of the anchor should be a number between 1 to 5.'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const {
      params: { price, maxMembers },
      transaction: { senderAddress },
    } = context;
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorStore = this.stores.get(AnchorStore);

    // Create anchor ID
    const id = getEntityID(context.transaction);
    // Create anchor object
    const anchor: Anchor = {
      price,
      consumable: price,
      streams: BigInt(0),
      members: [],
      maxMembers,
      creatorAddress: senderAddress,
    };

    // Store the anchor object in the blockchain
    await anchorStore.set(context, id, anchor);

    // Get the sender account from the blockchain
    const senderExists = await anchorAccountStore.has(context, senderAddress);
    let senderAccount: AnchorAccount;
    if (!senderExists) {
      senderAccount = {
        anchor: {
          owned: [id],
          shared: Buffer.alloc(0),
        },
      };
    } else {
      const retrievedAccount = await anchorAccountStore.get(context, senderAddress);
      senderAccount = {
        anchor: {
          owned: [...retrievedAccount.anchor.owned, id],
          shared: retrievedAccount.anchor.shared,
        },
      };
    }

    // Store the account object in the blockchain
    await anchorAccountStore.set(context, senderAddress, senderAccount);

    const anchorCreated = this.events.get(AnchorCreated);
    anchorCreated.add(context, {
      creatorAddress: context.transaction.senderAddress,
      anchorID: id,
      consumable: price,
      streams: BigInt(0),
    }, [context.transaction.senderAddress]);
  }
}
