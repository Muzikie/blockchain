import { BaseEndpoint, codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { CollectionAccountJSON } from './types';
import { accountStoreSchema } from './schemas';
import { CollectionAccountStore } from './stores/collectionAccount';

export class CollectionEndpoint extends BaseEndpoint {
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
}
