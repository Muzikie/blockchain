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
import { SubscriptionStore } from '../stores/subscription';
import { SubscriptionAccountStore } from '../stores/subscriptionAccount';
import { PurchaseCommandParams, SubscriptionAccount } from '../types';
import { purchaseCommandParamsSchema } from '../schemas';
import { DEV_ADDRESS, TREASURY_ADDRESS } from '../constants';

export class PurchaseCommand extends BaseCommand {
  public schema = purchaseCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<PurchaseCommandParams>,
  ): Promise<VerificationResult> {
    if (context.params.members?.length === 0) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Define at least one member'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<PurchaseCommandParams>): Promise<void> {
    const {
      params: { members, subscriptionID },
      transaction: { senderAddress },
      chainID,
    } = context;
    const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
    const methodContext = context.getMethodContext();
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    const subscriptionStore = this.stores.get(SubscriptionStore);

    // Throw if subscription didn't exist
    const subscriptionExists = await subscriptionStore.has(context, subscriptionID);
    if (!subscriptionExists) {
      throw new Error(`Subscription with ID ${subscriptionID.toString('hex')} does not exist`);
    }
    // Get subscription from the blockchain
    const subscriptionNFT = await subscriptionStore.get(context, subscriptionID);
    // Throw error if the members are more than the maximum allowed
    if (members.length > subscriptionNFT.maxMembers) {
      throw new Error(`The subscription only allows ${subscriptionNFT.maxMembers} members`);
    }
    // Throw error if the subscription doesn't is already active
    if (!subscriptionNFT.creatorAddress.equals(DEV_ADDRESS)) {
      throw new Error(`The subscription is already purchased.`);
    }

    // throw an error if the sender does not have enough tokens
    // Deduct the price from the sender account
    // Add 20% of the price to the creator account
    const devCosts = (subscriptionNFT.price * BigInt(2)) / BigInt(10);
    const consumable = subscriptionNFT.price - devCosts;

    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      DEV_ADDRESS,
      tokenID,
      devCosts,
    );
    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      TREASURY_ADDRESS,
      tokenID,
      consumable,
    );

    // Create subscription object
    const subscription = {
      ...subscriptionNFT,
      consumable,
      members,
      creatorAddress: senderAddress,
    };
    // Save subscription object on the blockchain
    await subscriptionStore.set(context, subscriptionID, subscription);

    // Add owned subscription and save the subscription on the sender account
    const senderExist = await subscriptionAccountStore.has(context, senderAddress);
    let senderAccount: SubscriptionAccount;
    if (senderExist) {
      senderAccount = await subscriptionAccountStore.get(context, senderAddress);
      senderAccount.subscription.owned = [...senderAccount.subscription.owned, subscriptionID];
    } else {
      senderAccount = {
        subscription: {
          owned: [subscriptionID],
          shared: Buffer.alloc(0),
        },
      };
    }

    await subscriptionAccountStore.set(context, senderAddress, senderAccount);

    // Remove subscription from the dev account
    const devAccount = await subscriptionAccountStore.get(context, DEV_ADDRESS);
    await subscriptionAccountStore.set(
      context,
      DEV_ADDRESS,
      {
        subscription: {
          owned: devAccount.subscription.owned.filter(item => !item.equals(subscriptionID)),
          shared: Buffer.alloc(0),
        },
      },
    );

    // Save the subscription on the members accounts
    for (const member of members) {
      const memberExist = await subscriptionAccountStore.has(context, member);
      let memberAccount: SubscriptionAccount;
      if (memberExist) {
        memberAccount = await subscriptionAccountStore.get(context, member);
        memberAccount.subscription.shared = subscriptionID;
      } else {
        memberAccount = {
          subscription: {
            owned: [Buffer.alloc(0)],
            shared: subscriptionID,
          },
        };
      }
      await subscriptionAccountStore.set(context, member, memberAccount);
    }
  }
}
