// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore, MethodContext } from 'lisk-framework';
import { Badge, Badges, UpdatedWinningAnchor } from '../types';
import { DATE_REG } from '../constants';

export const createBadgesForDay = async (
  context: MethodContext,
  badgeStore: BaseStore<Badge>,
  awardDate: string,
): Promise<boolean> => {
  if (!DATE_REG.test(awardDate)) {
    throw new Error('Parameter date must be a string in YYYY-MM-DD format.');
  }

  const badgeIDs = [1,2,3]
    .map((rank) => `${awardDate}-${rank}-${Badges.AOTD}`)
    .map(str => Buffer.from(str, 'utf8'));

  const badgeExists = await badgeStore.has(context, badgeIDs[0]);

  if (badgeExists) {
    return false;
  }

  await Promise.all(
    badgeIDs.map(async (badgeID, rank) => {
      const badge = {
        badgeID,
        anchorID: Buffer.from(''),
        awardedTo: Buffer.from(''),
        rank,
        type: Badges.AOTD,
        awardDate,
        prize: BigInt(0),
        claimed: false,
      };

      await badgeStore.set(context, badgeID, badge);
    }),
  );

  return true;
};

export const updateBadgesForDate = async (
  context: MethodContext,
  badgeStore: BaseStore<Badge>,
  date: string,
  updatedWinningAnchors: UpdatedWinningAnchor[],
): Promise<boolean> => {
  const badgeIDs = [1,2,3]
    .map((rank) => `${date}-${rank}-${Badges.AOTD}`)
    .map(id => Buffer.from(id, 'utf8'));

  const badges = await Promise.all(
    badgeIDs.map(async (badgeID) => badgeStore.get(context,  badgeID)),
  );

  for (const badge of badges) {
    const newAwardee  = updatedWinningAnchors.shift();
    const updatedBadge = {
      ...badge,
      ...newAwardee,
    }
    await badgeStore.set(context, badge.anchorID, updatedBadge);
  }

  return true;
};
