import { BaseEndpoint } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  hasSubscriptionResponse,
  SubscriptionAccountJSON,
  SubscriptionJSON,
  Subscription,
  SubscriptionAccount,
  Store,
} from './types';
import { SubscriptionAccountStore } from './stores/subscriptionAccount';
import { SubscriptionStore } from './stores/subscription';
import { getAccount, getSubscription, hasSubscription } from './controllers';

export class SubscriptionEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<SubscriptionAccountJSON> {
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    return getAccount(context, subscriptionAccountStore as Store<SubscriptionAccount>);
  }

  public async getSubscription(context: ModuleEndpointContext): Promise<SubscriptionJSON> {
    const subscriptionStore = this.stores.get(SubscriptionStore);
    return getSubscription(context, subscriptionStore as Store<Subscription>);
  }

  public async hasSubscription(context: ModuleEndpointContext): Promise<hasSubscriptionResponse> {
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    return hasSubscription(context, subscriptionAccountStore as Store<SubscriptionAccount>);
  }
}
