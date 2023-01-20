import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { UserAccountJSON, Store, UserAccount } from '../types';
import { accountStoreSchema } from '../schemas';

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
