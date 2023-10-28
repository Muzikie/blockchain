// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore, MethodContext } from 'lisk-framework';
import { Badge, Badges, UpdatedWinningAnchor } from '../types';
import { DATE_REG } from '../constants';
import { getBadgeID } from '../utils';

export const createBadgesForDay = async (
  context: MethodContext,
  badgeStore: BaseStore<Badge>,
  awardDate: string,
): Promise<Buffer[]> => {
  if (!DATE_REG.test(awardDate)) {
    throw new Error('Parameter date must be a string in YYYY-MM-DD format.');
  }

  const badgeIDs = [1, 2, 3]
    .map((rank) => getBadgeID(awardDate, rank, Badges.AOTD));
  const badgeExists = await badgeStore.has(context, badgeIDs[0]);

  if (!badgeExists) {
    await Promise.all(
      badgeIDs.map(async (badgeID, index) => {
        const badge = {
          badgeID,
          anchorID: Buffer.from(''),
          awardedTo: Buffer.from(''),
          rank: index + 1,
          type: Badges.AOTD,
          awardDate,
          prize: BigInt(0),
          claimed: false,
        };
  
        await badgeStore.set(context, badgeID, badge);
      }),
    );
  }

  return badgeIDs;
};

export const updateBadgesForDate = async (
  context: MethodContext,
  badgeStore: BaseStore<Badge>,
  date: string,
  updatedWinningAnchors: UpdatedWinningAnchor[],
): Promise<boolean> => {
  const badgeIDs = [1, 2, 3]
    .map((rank) => getBadgeID(date, rank, Badges.AOTD))

  const badges = await Promise.all(
    badgeIDs.map(async (badgeID) => badgeStore.get(context,  badgeID)),
  );

  let index = 0;
  for (const badge of badges) {
    const newAwardee  = updatedWinningAnchors[index];
    const updatedBadge = {
      ...badge,
      ...newAwardee,
    }
    await badgeStore.set(context, badge.badgeID, updatedBadge);
    index += 1;
  }

  return true;
};
