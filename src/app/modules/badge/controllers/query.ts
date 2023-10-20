import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, BaseStore } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { BadgeAccountJSON, BadgeJSON, Badge, BadgeAccount, Badges } from '../types';
import { accountStoreSchema, badgeStoreSchema } from '../schemas';

export const getAccount = async (
  context: ModuleEndpointContext,
  badgeAccountSubStore: BaseStore<BadgeAccount>,
): Promise<BadgeAccountJSON> => {
  const { address } = context.params;

  if (typeof address !== 'string') {
    throw new Error('Parameter address must be a string.');
  }

  const isValidAddress = cryptoAddress.validateLisk32Address(address);
  if (!isValidAddress) {
    throw new Error('Parameter address must be a valid address.');
  }

  const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

  const accountExists = await badgeAccountSubStore.has(context, addressBuffer);

  if (!accountExists) {
    throw new Error(`No account with address ${address} found.`);
  }

  const accountData = await badgeAccountSubStore.get(context, addressBuffer);
  const accountJSON: BadgeAccountJSON = codec.toJSON(accountStoreSchema, accountData);
  return accountJSON;
};

export const getBadge = async (
  context: ModuleEndpointContext,
  badgeSubStore: BaseStore<Badge>,
): Promise<BadgeJSON> => {
  const { badgeID } = context.params;

  let query: Buffer;

  if (Buffer.isBuffer(badgeID)) {
    query = badgeID;
  } else if (typeof badgeID === 'string') {
    query = Buffer.from(badgeID, 'hex');
  } else {
    throw new Error('Parameter badgeID must be a string or a buffer.');
  }

  const badgeExists = await badgeSubStore.has(context, query);

  if (!badgeExists) {
    throw new Error(`No badge with id ${query.toString('hex')} found.`);
  }

  const badgeData = await badgeSubStore.get(context, query);
  const badgeJSON: BadgeJSON = codec.toJSON(badgeStoreSchema, badgeData);
  return badgeJSON;
};

export const getWinningAnchorsForDate = async (
  context: ModuleEndpointContext,
  badgeStore: BaseStore<Badge>,
): Promise<Buffer[]> => {
  const date = context.params.date as string;
  const badgeIDs = [1, 2, 3]
    .map((rank) => `${date}-${rank}-${Badges.AOTD}`)
    .map(id => Buffer.from(id, 'utf8'));

  const badges = await Promise.all(
    badgeIDs.map(async badgeID => badgeStore.get(context, badgeID)),
  );

  return badges.map((badge: Badge) => badge.anchorID);
}
