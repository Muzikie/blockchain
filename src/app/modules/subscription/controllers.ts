import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import {
  SubscriptionAccountJSON,
  SubscriptionJSON,
  Subscription,
  SubscriptionAccount,
  Store,
} from './types';
import { accountStoreSchema, subscriptionStoreSchema } from './schemas';

export const getAccount = async (
  context: ModuleEndpointContext,
  subscriptionAccountStore: Store<SubscriptionAccount>,
): Promise<SubscriptionAccountJSON> => {
  const { address } = context.params;

  if (typeof address !== 'string') {
    throw new Error('Parameter address must be a string.');
  }

  const isValidAddress = cryptoAddress.validateLisk32Address(address);
  if (!isValidAddress) {
    throw new Error('Parameter address must be a valid address.');
  }

  const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

  const accountExists = await subscriptionAccountStore.has(
    context,
    addressBuffer,
  );

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await subscriptionAccountStore.get(
    context,
    addressBuffer,
  );
  const accountJSON: SubscriptionAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
}

export const getSubscription = async (
  context: ModuleEndpointContext,
  SubscriptionStore: Store<Subscription>,
): Promise<SubscriptionJSON> => {
  const { subscriptionID } = context.params;

  let query: Buffer;

  if (Buffer.isBuffer(subscriptionID)) {
    query = subscriptionID;
  } else if (typeof subscriptionID === 'string') {
    query = Buffer.from(subscriptionID, 'hex');
  } else {
    throw new Error('Parameter subscriptionID must be a string or a buffer.');
  }

  const subscriptionExists = await SubscriptionStore.has(
    context,
    query,
  );

  if (!subscriptionExists) {
    throw new Error(`No subscription with id ${query.toString('hex')} found.`);
  }

  const subscriptionData = await SubscriptionStore.get(
    context,
    query,
  );
  const subscriptionJSON: SubscriptionJSON = codec.toJSON(subscriptionStoreSchema, subscriptionData);
  return subscriptionJSON;
}
