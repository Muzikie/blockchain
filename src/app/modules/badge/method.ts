import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import { BadgeAccountJSON, BadgeJSON, UpdatedWinningAnchor, Badge } from './types';
import { BadgeAccountStore } from './stores/badgeAccount';
import { BadgeStore } from './stores/badge';
import { getAccount, getBadge, getWinningAnchorsForDate } from './controllers/query';
import { createBadgesForDay, updateBadgesForDate } from './controllers/post';

export class BadgeMethod extends BaseMethod {
  public async getAccount(context: ModuleEndpointContext): Promise<BadgeAccountJSON> {
    const badgeAccountStore = this.stores.get(BadgeAccountStore);
    return getAccount(context, badgeAccountStore);
  }

  public async getBadge(context: ModuleEndpointContext): Promise<BadgeJSON> {
    const badgeStore = this.stores.get(BadgeStore);
    return getBadge(context, badgeStore);
  }

  public async createBadgesForDay(context: MethodContext, awardDate: string): Promise<Buffer[]> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return createBadgesForDay(context, badgeSubStore, awardDate);
  }

  public async getWinningAnchorsForDate(context: MethodContext, date: string): Promise<Pick<Badge, 'anchorID' | 'awardedTo'>[]> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return getWinningAnchorsForDate(context, badgeSubStore, date);
  }

  public async updateBadgesForDate(context: MethodContext, date: string, updatedWinningAnchors: UpdatedWinningAnchor[]): Promise<boolean> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return updateBadgesForDate(context, badgeSubStore, date, updatedWinningAnchors);
  }
}
