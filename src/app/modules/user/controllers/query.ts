import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import {
  UserAccountJSON,
  Store,
  UserAccount,
  User,
  UserJSON,
} from '../types';
import { accountStoreSchema, userStoreSchema } from '../schemas';

export const getAccount = async (
  context: ModuleEndpointContext,
  userAccountStore: Store<UserAccount>,
): Promise<UserAccountJSON> => {
  const { address } = context.params;

  if (typeof address !== 'string') {
    throw new Error('Parameter address must be a string.');
  }

  const isValidAddress = cryptoAddress.validateLisk32Address(address);
  if (!isValidAddress) {
    throw new Error('Parameter address must be a valid address.');
  }

  const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

  const accountExists = await userAccountStore.has(context, addressBuffer);

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await userAccountStore.get(context, addressBuffer);
  const accountJSON: UserAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
};

export const getUser = async (
  context: ModuleEndpointContext,
  userSubStore: Store<User>,
): Promise<UserJSON> => {
  const { userID } = context.params;

  let query: Buffer;

  if (Buffer.isBuffer(userID)) {
    query = userID;
  } else if (typeof userID === 'string') {
    query = Buffer.from(userID, 'hex');
  } else {
    throw new Error('Parameter userID must be a string or a buffer.');
  }

  const userExists = await userSubStore.has(context, query);

  if (!userExists) {
    throw new Error(`No user with id ${query.toString('hex')} found.`);
  }

  const userData = await userSubStore.get(context, query);
  const userJSON: UserJSON = codec.toJSON(userStoreSchema, userData);
  return userJSON;
};
