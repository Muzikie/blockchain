import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  SubscriptionAccountJSON,
  SubscriptionJSON,
} from './types';
import { SubscriptionAccountStore } from './stores/subscriptionAccount';
import { SubscriptionStore } from './stores/subscription';
import { getAccount, getSubscription } from './controllers';

export class SubscriptionMethod extends BaseMethod {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<SubscriptionAccountJSON> {
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    return getAccount(context, subscriptionAccountStore)
  }

  // Get Subscription by subscriptionID
  public async getSubscription(context: ModuleEndpointContext): Promise<SubscriptionJSON> {
    const subscriptionStore = this.stores.get(SubscriptionStore);
    return getSubscription(context, subscriptionStore);
  }
}
