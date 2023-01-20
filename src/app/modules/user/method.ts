import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { UserAccountJSON, UserAccount, Store } from './types';
import { UserAccountStore } from './stores/userAccount';
import { getAccount } from './controllers/query';

export class UserMethod extends BaseMethod {
  public async getAccount(context: ModuleEndpointContext): Promise<UserAccountJSON> {
    const userAccountSubStore = this.stores.get(UserAccountStore);
    return getAccount(context, userAccountSubStore as Store<UserAccount>);
  }
}
