import { BaseEndpoint } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { BadgeAccountJSON, BadgeJSON } from './types';
import { BadgeAccountStore } from './stores/badgeAccount';
import { BadgeStore } from './stores/badge';
import { getAccount, getBadge } from './controllers/query';

export class BadgeEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<BadgeAccountJSON> {
    const badgeAccountStore = this.stores.get(BadgeAccountStore);
    return getAccount(context, badgeAccountStore);
  }

  public async getBadge(context: ModuleEndpointContext): Promise<BadgeJSON> {
    const badgeStore = this.stores.get(BadgeStore);
    return getBadge(context, badgeStore);
  }
}
