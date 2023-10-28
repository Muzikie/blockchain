import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import { AnchorAccountJSON, AnchorJSON } from './types';
import { AnchorAccountStore } from './stores/anchorAccount';
import { AnchorStore } from './stores/anchor';
import { AnchorStatsStore } from './stores/anchorStats';
import { getAccount, getAnchor, getVoteCounts } from './controllers';

export class AnchorMethod extends BaseMethod {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<AnchorAccountJSON> {
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    return getAccount(context, anchorAccountStore);
  }

  // Get Anchor by anchorID
  public async getAnchor(context: ModuleEndpointContext): Promise<AnchorJSON> {
    const anchorStore = this.stores.get(AnchorStore);
    return getAnchor(context, anchorStore);
  }
  
  // Get VotesCount by date
  public async getVoteCounts(context: MethodContext, date: string): Promise<number> {
    const anchorStatsStore = this.stores.get(AnchorStatsStore);
    const response = await getVoteCounts(context, date, anchorStatsStore);
    return response;
  }
}

