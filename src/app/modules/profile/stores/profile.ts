// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Profile } from '../types';
import { profileStoreSchema } from '../schemas';

export class ProfileStore extends BaseStore<Profile> {
  public schema = profileStoreSchema;
}
