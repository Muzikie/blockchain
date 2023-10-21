import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { AnchorAccountJSON, AnchorJSON } from './types';
import { AnchorAccountStore } from './stores/anchorAccount';
import { AnchorStore } from './stores/anchor';
import { getAccount, getAnchor } from './controllers';

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
}
