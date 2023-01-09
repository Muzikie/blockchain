// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { CollectionAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class CollectionAccountStore extends BaseStore<CollectionAccount> {
  public schema = accountStoreSchema;
}
