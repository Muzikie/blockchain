import { BaseEndpoint } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import {
  CollectionAccountJSON,
  CollectionJSON,
  CollectionAccount,
  Store,
  Collection,
} from './types';
import { CollectionAccountStore } from './stores/collectionAccount';
import { CollectionStore } from './stores/collection';
import { getAccount, getAudio } from './controllers';

export class CollectionEndpoint extends BaseEndpoint {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<CollectionAccountJSON> {
    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    return getAccount(context, collectionAccountSubStore as Store<CollectionAccount>)
  }

  // Get Collection by collectionID
  public async getAudio(context: ModuleEndpointContext): Promise<CollectionJSON> {
    const collectionSubStore = this.stores.get(CollectionStore);
    return getAudio(context, collectionSubStore as Store<Collection>);
  }
}
