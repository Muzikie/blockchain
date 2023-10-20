import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import { BadgeAccountJSON, BadgeJSON, Badge, BadgeAccount, Store} from './types';
import { BadgeAccountStore } from './stores/badgeAccount';
import { BadgeStore } from './stores/badge';
import { getAccount, getBadge } from './controllers/query';

export class BadgeMethod extends BaseMethod {
  public async getAccount(context: ModuleEndpointContext): Promise<BadgeAccountJSON> {
    const badgeAccountStore = this.stores.get(BadgeAccountStore);
    return getAccount(context, badgeAccountStore as Store<BadgeAccount>);
  }

  public async getBadge(context: ModuleEndpointContext): Promise<BadgeJSON> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return getBadge(context, badgeSubStore as Store<Badge>);
  }
  

  public async getWinningAnchorsForDate(context: ModuleEndpointContext, date: string): Promise<Buffer[]> {
    const BADGE_TYPE = 'anchor_of_the_day'
    const badgeStore = this.stores.get(BadgeStore);
    
    const badgeIDs = [1,2,3].map((rank) => `${date}-${rank}-${BADGE_TYPE}`);

    const badges = await Promise.all(
      badgeIDs.map(async (badgeID) => badgeStore.get(context, Buffer.from(badgeID, 'hex'))),
    );
  
    return badges.map((badge) => badge.anchorID);
  }
  
  public async updateBadgesForDate(context: MethodContext, date: string, updatedWinningAnchors: Array<Buffer>) {
    const BADGE_TYPE = 'anchor_of_the_day'

    const badgeIDs = [1,2,3].map((rank) => `${date}-${rank}-${BADGE_TYPE}`);
    const badgeSubStore = this.stores.get(BadgeStore);
  
    const badges = await Promise.all(
      badgeIDs.map(async (badgeID) => badgeSubStore.get(context,  Buffer.from(badgeID, 'hex'))),
    );
  
    for (const badge of badges) {
      const newAwardee  = updatedWinningAnchors.shift();
      const updatedBadge = {
        ...badge,
        ...newAwardee,
      }
      await badgeSubStore.set(context, badge.anchorID, updatedBadge);
    }
  
    return true;
  }
  
}




