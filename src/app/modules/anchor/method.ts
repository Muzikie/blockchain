import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import {
  AnchorAccountJSON,
  AnchorJSON,
  GetByAddressResult,
  hasAnchorResponse,
  AnchorAccount,
  Store,
} from './types';
import { AnchorAccountStore } from './stores/anchorAccount';
import { AnchorStore } from './stores/anchor';
import { getAccount, getAnchor, hasAnchor } from './controllers';
import { STREAM_COST } from '../badge/constants';

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

  public async hasAnchor(context: ModuleEndpointContext): Promise<hasAnchorResponse> {
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    return hasAnchor(context, anchorAccountStore as Store<AnchorAccount>);
  }

  public async getByAddress(context: MethodContext, address: Buffer): Promise<GetByAddressResult> {
    if (!Buffer.isBuffer(address)) {
      throw new Error('Address must be a buffer.');
    }

    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const accountExists = await anchorAccountStore.has(context, address);
    if (!accountExists) {
      throw new Error('Account is not a member of an existing anchor.');
    }
    const account = await anchorAccountStore.get(context, address);
    if (!account.anchor.shared) {
      throw new Error('Account is not a member of an existing anchor.');
    }

    const anchorStore = this.stores.get(AnchorStore);
    const anchorData = await anchorStore.get(context, account.anchor.shared);
    return {
      anchorID: account.anchor.shared,
      data: anchorData,
    };
  }

  public async consume(
    context: MethodContext,
    anchorID: Buffer,
    address: Buffer,
  ): Promise<void> {
    if (!Buffer.isBuffer(anchorID)) {
      throw new Error('anchorID must be a buffer.');
    }

    const anchorStore = this.stores.get(AnchorStore);
    const anchorExists = await anchorStore.has(context, anchorID);
    if (!anchorExists) {
      throw new Error(`anchor with ID ${anchorID.toString('hex')} does not exist.`);
    }
    const anchor = await anchorStore.get(context, anchorID);
    if (!anchor?.members.find(item => item.equals(address))) {
      throw new Error('Account is not a member of the given anchor.');
    }
    await anchorStore.set(context, anchorID, {
      ...anchor,
      consumable: anchor.consumable - STREAM_COST,
    });
  }
}
