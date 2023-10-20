import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import { BadgeAccountJSON, BadgeJSON} from './types';
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

  public async createBadgesForDay(context: MethodContext, awardDate: string): Promise<boolean> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return createBadgesForDay(context, badgeSubStore, awardDate);
  }

  public async getWinningAnchorsForDate(context: ModuleEndpointContext): Promise<Buffer[]> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return getWinningAnchorsForDate(context, badgeSubStore);
  }

  public async updateBadgesForDate(context: MethodContext, date: string, updatedWinningAnchors: Buffer[]): Promise<boolean> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return updateBadgesForDate(context, badgeSubStore, date, updatedWinningAnchors);
  }
}
