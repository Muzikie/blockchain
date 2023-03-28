// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { ProfileAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class ProfileAccountStore extends BaseStore<ProfileAccount> {
  public schema = accountStoreSchema;
}
