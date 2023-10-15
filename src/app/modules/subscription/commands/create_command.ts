/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { SubscriptionStore } from '../stores/subscription';
import { SubscriptionAccountStore } from '../stores/subscriptionAccount';
import { SubscriptionCreated } from '../events/subscriptionCreated';
import { CreateCommandParams, Subscription, SubscriptionAccount } from '../types';
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
        error: new Error('You are not authorized to create a subscription.'),
      };
    }
    if (context.params.maxMembers === 0 || context.params.maxMembers > 5) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Max members of the subscription should be a number between 1 to 5.'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const {
      params: { price, maxMembers },
      transaction: { senderAddress },
    } = context;
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    const subscriptionStore = this.stores.get(SubscriptionStore);

    // Create subscription ID
    const id = getEntityID(context.transaction);
    // Create subscription object
    const subscription: Subscription = {
      price,
      consumable: price,
      streams: BigInt(0),
      members: [],
      maxMembers,
      creatorAddress: senderAddress,
    };

    // Store the subscription object in the blockchain
    await subscriptionStore.set(context, id, subscription);

    // Get the sender account from the blockchain
    const senderExists = await subscriptionAccountStore.has(context, senderAddress);
    let senderAccount: SubscriptionAccount;
    if (!senderExists) {
      senderAccount = {
        subscription: {
          owned: [id],
          shared: Buffer.alloc(0),
        },
      };
    } else {
      const retrievedAccount = await subscriptionAccountStore.get(context, senderAddress);
      senderAccount = {
        subscription: {
          owned: [...retrievedAccount.subscription.owned, id],
          shared: retrievedAccount.subscription.shared,
        },
      };
    }

    // Store the account object in the blockchain
    await subscriptionAccountStore.set(context, senderAddress, senderAccount);

    const subscriptionCreated = this.events.get(SubscriptionCreated);
    subscriptionCreated.add(context, {
      creatorAddress: context.transaction.senderAddress,
      subscriptionID: id,
      consumable: price,
      streams: BigInt(0),
    }, [context.transaction.senderAddress]);
  }
}
