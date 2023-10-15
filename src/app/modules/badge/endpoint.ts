import { BaseEndpoint } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { BadgeAccountJSON, BadgeJSON, Badge, BadgeAccount, Store } from './types';
import { BadgeAccountStore } from './stores/badgeAccount';
import { BadgeStore } from './stores/badge';
import { getAccount, getBadge } from './controllers/query';

export class BadgeEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<BadgeAccountJSON> {
    const badgeAccountSubStore = this.stores.get(BadgeAccountStore);
    return getAccount(context, badgeAccountSubStore as Store<BadgeAccount>);
  }

  public async getBadge(context: ModuleEndpointContext): Promise<BadgeJSON> {
    const badgeSubStore = this.stores.get(BadgeStore);
    return getBadge(context, badgeSubStore as Store<Badge>);
  }
}
