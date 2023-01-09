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

  const accountExists = await subscriptionAccountStore.has(context, addressBuffer);

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await subscriptionAccountStore.get(context, addressBuffer);
  const accountJSON: SubscriptionAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
};

export const getSubscription = async (
  context: ModuleEndpointContext,
  subscriptionStore: Store<Subscription>,
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

  const subscriptionExists = await subscriptionStore.has(context, query);

  if (!subscriptionExists) {
    throw new Error(`No subscription with id ${query.toString('hex')} found.`);
  }

  const subscriptionData = await subscriptionStore.get(context, query);
  const subscriptionJSON: SubscriptionJSON = codec.toJSON(
    subscriptionStoreSchema,
    subscriptionData,
  );
  return subscriptionJSON;
};

export const hasSubscription = async (
  context: ModuleEndpointContext,
  subscriptionAccountStore: Store<SubscriptionAccount>,
) => {
  if (typeof context.params.address !== 'string') {
    return {
      success: false,
      message: 'Parameter address must be a string.',
    };
  }

  const queryAddress = cryptoAddress.getAddressFromLisk32Address(context.params.address);
  const accountExists = await subscriptionAccountStore.has(context, queryAddress);

  if (!accountExists) {
    return {
      success: false,
      message: 'Account has no valid subscription.',
    };
  }

  const account = await subscriptionAccountStore.get(context, queryAddress);
  if (!account.subscription.shared) {
    return {
      success: false,
      message: 'Account has no valid subscription.',
    };
  }

  return {
    success: true,
  };
};
