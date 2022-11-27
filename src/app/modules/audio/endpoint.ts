import { BaseEndpoint, codec } from 'lisk-sdk';
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
// import { getAllAudios, getAudio, createAudio } from './controller';
import { AudioJSON } from './types';
import { accountStoreSchema } from './schemas';
import { AudioAccountStore } from './stores/audioAccount';

export class AudioEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<AudioJSON> {
    // const accountSubStore = this.stores.get(LNSAccountStore);
    const audioAccountSubStore = this.stores.get(AudioAccountStore);
    const { address } = context.params;

    if (typeof address !== 'string') {
      throw new Error('Parameter address must be a string.');
    }

    const isValidAddress = cryptoAddress.validateLisk32Address(address);
    if (!isValidAddress) {
      throw new Error('Parameter address must be a valid address.');
    }

    const addressBuffer = cryptoAddress.getAddressFromLisk32Address(address);

    const accountExists = await audioAccountSubStore.has(
      context,
      addressBuffer,
    );

    if (!accountExists) {
      throw new Error(`No account with address ${address} found.`);
    }

    const accountData = await audioAccountSubStore.get(
      context,
      addressBuffer,
    );
    const accountJSON: AudioJSON = codec.toJSON(accountStoreSchema, accountData);
    return accountJSON;
  }
}
