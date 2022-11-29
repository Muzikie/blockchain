import { BaseEndpoint, codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { CollectionAccountJSON, CollectionJSON } from './types';
import { accountStoreSchema, collectionStoreSchema } from './schemas';
import { CollectionAccountStore } from './stores/collectionAccount';
import { CollectionStore } from './stores/collection';

export class CollectionEndpoint extends BaseEndpoint {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<CollectionAccountJSON> {
    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    const { address } = context.params;

    if (typeof address !== 'string') {
      throw new Error('Parameter address must be a string.');
    }

    const isValidAddress = cryptoAddress.validateLisk32Address(address);
    if (!isValidAddress) {
      throw new Error('Parameter address must be a valid address.');
    }

    const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

    const accountExists = await collectionAccountSubStore.has(
      context,
      addressBuffer,
    );

    if (!accountExists) {
      throw new Error(`No account with address ${address} found.`);
    }

    const accountData = await collectionAccountSubStore.get(
      context,
      addressBuffer,
    );
    const accountJSON: CollectionAccountJSON = codec.toJSON(accountStoreSchema, accountData);
    return accountJSON;
  }

  // Get Collection by collectionID
  public async getAudio(context: ModuleEndpointContext): Promise<CollectionJSON> {
    const collectionSubStore = this.stores.get(CollectionStore);
    const { collectionID } = context.params;

    let query: Buffer;

    if (Buffer.isBuffer(collectionID)) {
      query = collectionID;
    } else if (typeof collectionID === 'string') {
      query = Buffer.from(collectionID, 'hex');
    } else {
      throw new Error('Parameter collectionID must be a string or a buffer.');
    }

    const collectionExists = await collectionSubStore.has(
      context,
      query,
    );

    if (!collectionExists) {
      throw new Error(`No collection with id ${query.toString('hex')} found.`);
    }

    const collectionData = await collectionSubStore.get(
      context,
      query,
    );
    const collectionJSON: CollectionJSON = codec.toJSON(collectionStoreSchema, collectionData);
    return collectionJSON;
  }
}
