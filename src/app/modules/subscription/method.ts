import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import {
  SubscriptionAccountJSON,
  SubscriptionJSON,
  GetByAddressResult,
  hasSubscriptionResponse,
  SubscriptionAccount,
  Store,
} from './types';
import { SubscriptionAccountStore } from './stores/subscriptionAccount';
import { SubscriptionStore } from './stores/subscription';
import { getAccount, getSubscription, hasSubscription } from './controllers';
import { STREAM_COST } from '../audio/constants';

export class SubscriptionMethod extends BaseMethod {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<SubscriptionAccountJSON> {
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    return getAccount(context, subscriptionAccountStore);
  }

  // Get Subscription by subscriptionID
  public async getSubscription(context: ModuleEndpointContext): Promise<SubscriptionJSON> {
    const subscriptionStore = this.stores.get(SubscriptionStore);
    return getSubscription(context, subscriptionStore);
  }

  public async hasSubscription(context: ModuleEndpointContext): Promise<hasSubscriptionResponse> {
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    return hasSubscription(context, subscriptionAccountStore as Store<SubscriptionAccount>);
  }

  public async getByAddress(context: MethodContext, address: Buffer): Promise<GetByAddressResult> {
    if (!Buffer.isBuffer(address)) {
      throw new Error('Address must be a buffer.');
    }

    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    const accountExists = await subscriptionAccountStore.has(context, address);
    if (!accountExists) {
      throw new Error('Account is not a member of an existing subscription.');
    }
    const account = await subscriptionAccountStore.get(context, address);
    if (!account.subscription.shared) {
      throw new Error('Account is not a member of an existing subscription.');
    }

    const subscriptionStore = this.stores.get(SubscriptionStore);
    const subscriptionData = await subscriptionStore.get(context, account.subscription.shared);
    return {
      subscriptionID: account.subscription.shared,
      data: subscriptionData,
    };
  }

  public async consume(
    context: MethodContext,
    subscriptionID: Buffer,
    address: Buffer,
  ): Promise<void> {
    if (!Buffer.isBuffer(subscriptionID)) {
      throw new Error('subscriptionID must be a buffer.');
    }

    const subscriptionStore = this.stores.get(SubscriptionStore);
    const subscriptionExists = await subscriptionStore.has(context, subscriptionID);
    if (!subscriptionExists) {
      throw new Error(`subscription with ID ${subscriptionID.toString('hex')} does not exist.`);
    }
    const subscription = await subscriptionStore.get(context, subscriptionID);
    if (!subscription?.members.find(item => item.equals(address))) {
      throw new Error('Account is not a member of the given subscription.');
    }
    await subscriptionStore.set(context, subscriptionID, {
      ...subscription,
      consumable: subscription.consumable - STREAM_COST,
    });
  }
}
