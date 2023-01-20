// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { UserAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class UserAccountStore extends BaseStore<UserAccount> {
  public schema = accountStoreSchema;
}
