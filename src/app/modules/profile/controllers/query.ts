import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import {
  ProfileAccountJSON,
  Store,
  ProfileAccount,
  Profile,
  ProfileJSON,
} from '../types';
import { accountStoreSchema, profileStoreSchema } from '../schemas';

export const getAccount = async (
  context: ModuleEndpointContext,
  profileAccountStore: Store<ProfileAccount>,
): Promise<ProfileAccountJSON> => {
  const { address } = context.params;

  if (typeof address !== 'string') {
    throw new Error('Parameter address must be a string.');
  }

  const isValidAddress = cryptoAddress.validateLisk32Address(address);
  if (!isValidAddress) {
    throw new Error('Parameter address must be a valid address.');
  }

  const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

  const accountExists = await profileAccountStore.has(context, addressBuffer);

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await profileAccountStore.get(context, addressBuffer);
  const accountJSON: ProfileAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
};

export const getProfile = async (
  context: ModuleEndpointContext,
  profileSubStore: Store<Profile>,
): Promise<ProfileJSON> => {
  const { profileID } = context.params;

  let query: Buffer;

  if (Buffer.isBuffer(profileID)) {
    query = profileID;
  } else if (typeof profileID === 'string') {
    query = Buffer.from(profileID, 'hex');
  } else {
    throw new Error('Parameter profileID must be a string or a buffer.');
  }

  const profileExists = await profileSubStore.has(context, query);

  if (!profileExists) {
    throw new Error(`No profile with id ${query.toString('hex')} found.`);
  }

  const profileData = await profileSubStore.get(context, query);
  const profileJSON: ProfileJSON = codec.toJSON(profileStoreSchema, profileData);
  return profileJSON;
};
