import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  ProfileAccountJSON,
  ProfileAccount,
  Profile,
  ProfileJSON,
  Store
} from './types';
import { ProfileAccountStore } from './stores/profileAccount';
import { ProfileStore } from './stores/profile';
import { getAccount, getProfile } from './controllers/query';

export class ProfileMethod extends BaseMethod {
  public async getAccount(context: ModuleEndpointContext): Promise<ProfileAccountJSON> {
    const profileAccountSubStore = this.stores.get(ProfileAccountStore);
    return getAccount(context, profileAccountSubStore as Store<ProfileAccount>);
  }

  public async getProfile(context: ModuleEndpointContext): Promise<ProfileJSON> {
    const profileStore = this.stores.get(ProfileStore);
    return getProfile(context, profileStore as Store<Profile>);
  }
}
