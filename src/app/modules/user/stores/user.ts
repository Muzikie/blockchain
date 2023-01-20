// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { User } from '../types';
import { userStoreSchema } from '../schemas';

export class UserStore extends BaseStore<User> {
  public schema = userStoreSchema;
}
