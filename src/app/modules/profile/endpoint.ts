import { BaseEndpoint } from 'lisk-sdk';
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

export class ProfileEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<ProfileAccountJSON> {
    const profileAccountStore = this.stores.get(ProfileAccountStore);
    return getAccount(context, profileAccountStore as Store<ProfileAccount>);
  }

  public async getProfile(context: ModuleEndpointContext): Promise<ProfileJSON> {
    const profileStore = this.stores.get(ProfileStore);
    return getProfile(context, profileStore as Store<Profile>);
  }
}
