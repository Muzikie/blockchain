import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  UserAccountJSON,
  UserAccount,
  User,
  UserJSON,
  Store
} from './types';
import { UserAccountStore } from './stores/userAccount';
import { UserStore } from './stores/user';
import { getAccount, getUser } from './controllers/query';

export class UserMethod extends BaseMethod {
  public async getAccount(context: ModuleEndpointContext): Promise<UserAccountJSON> {
    const userAccountSubStore = this.stores.get(UserAccountStore);
    return getAccount(context, userAccountSubStore as Store<UserAccount>);
  }

  public async getUser(context: ModuleEndpointContext): Promise<UserJSON> {
    const userStore = this.stores.get(UserStore);
    return getUser(context, userStore as Store<User>);
  }
}
