import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import {
  AnchorAccountJSON,
  AnchorJSON,
  Anchor,
  AnchorAccount,
  Store,
} from './types';
import { accountStoreSchema, anchorStoreSchema } from './schemas';

export const getAccount = async (
  context: ModuleEndpointContext,
  anchorAccountStore: Store<AnchorAccount>,
): Promise<AnchorAccountJSON> => {
  const { address } = context.params;

  if (typeof address !== 'string') {
    throw new Error('Parameter address must be a string.');
  }

  const isValidAddress = cryptoAddress.validateLisk32Address(address);
  if (!isValidAddress) {
    throw new Error('Parameter address must be a valid address.');
  }

  const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

  const accountExists = await anchorAccountStore.has(context, addressBuffer);

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await anchorAccountStore.get(context, addressBuffer);
  const accountJSON: AnchorAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
};

export const getAnchor = async (
  context: ModuleEndpointContext,
  anchorStore: Store<Anchor>,
): Promise<AnchorJSON> => {
  const { anchorID } = context.params;

  let query: Buffer;

  if (Buffer.isBuffer(anchorID)) {
    query = anchorID;
  } else if (typeof anchorID === 'string') {
    query = Buffer.from(anchorID, 'hex');
  } else {
    throw new Error('Parameter anchorID must be a string or a buffer.');
  }

  const anchorExists = await anchorStore.has(context, query);

  if (!anchorExists) {
    throw new Error(`No anchor with id ${query.toString('hex')} found.`);
  }

  const anchorData = await anchorStore.get(context, query);
  const anchorJSON: AnchorJSON = codec.toJSON(
    anchorStoreSchema,
    anchorData,
  );
  return anchorJSON;
};

export const hasAnchor = async (
  context: ModuleEndpointContext,
  anchorAccountStore: Store<AnchorAccount>,
) => {
  if (typeof context.params.address !== 'string') {
    return {
      success: false,
      message: 'Parameter address must be a string.',
    };
  }

  const queryAddress = cryptoAddress.getAddressFromLisk32Address(context.params.address);
  const accountExists = await anchorAccountStore.has(context, queryAddress);

  if (!accountExists) {
    return {
      success: false,
      message: 'Account has no valid anchor.',
    };
  }

  const account = await anchorAccountStore.get(context, queryAddress);
  if (!account.anchor.shared) {
    return {
      success: false,
      message: 'Account has no valid anchor.',
    };
  }

  return {
    success: true,
  };
};
