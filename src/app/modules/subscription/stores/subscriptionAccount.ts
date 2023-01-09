// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { SubscriptionAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class SubscriptionAccountStore extends BaseStore<SubscriptionAccount> {
  public schema = accountStoreSchema;
}
