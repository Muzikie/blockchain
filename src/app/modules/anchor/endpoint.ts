import { BaseEndpoint } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  hasAnchorResponse,
  AnchorAccountJSON,
  AnchorJSON,
  Anchor,
  AnchorAccount,
  Store,
} from './types';
import { AnchorAccountStore } from './stores/anchorAccount';
import { AnchorStore } from './stores/anchor';
import { getAccount, getAnchor, hasAnchor } from './controllers';

export class AnchorEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<AnchorAccountJSON> {
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    return getAccount(context, anchorAccountStore as Store<AnchorAccount>);
  }

  public async getAnchor(context: ModuleEndpointContext): Promise<AnchorJSON> {
    const anchorStore = this.stores.get(AnchorStore);
    return getAnchor(context, anchorStore as Store<Anchor>);
  }

  public async hasAnchor(context: ModuleEndpointContext): Promise<hasAnchorResponse> {
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    return hasAnchor(context, anchorAccountStore as Store<AnchorAccount>);
  }
}
