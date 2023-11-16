// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { BadgeAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class BadgeAccountStore extends BaseStore<BadgeAccount> {
  public schema = accountStoreSchema;
}
