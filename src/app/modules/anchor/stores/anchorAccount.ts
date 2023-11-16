// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { AnchorAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class AnchorAccountStore extends BaseStore<AnchorAccount> {
  public schema = accountStoreSchema;
}
