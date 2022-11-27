import { BaseEndpoint, codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { AudioAccountJSON, AudioJSON } from './types';
import { accountStoreSchema, audioStoreSchema } from './schemas';
import { AudioAccountStore } from './stores/audioAccount';
import { AudioStore } from './stores/audio';

export class AudioEndpoint extends BaseEndpoint {
  public async getAccount(context: ModuleEndpointContext): Promise<AudioAccountJSON> {
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
    const accountJSON: AudioAccountJSON = codec.toJSON(accountStoreSchema, accountData);
    return accountJSON;
  }

  public async getAudio(context: ModuleEndpointContext): Promise<AudioJSON> {
    const audioSubStore = this.stores.get(AudioStore);
    const { audioID } = context.params;

    let query: Buffer = Buffer.alloc(0)

    if (Buffer.isBuffer(audioID)) {
      query = audioID;
    } else if (typeof audioID === 'string') {
      query = Buffer.from(audioID, 'hex');
    } else {
      throw new Error('Parameter audioID must be a string or a buffer.');
    }

    const audioExists = await audioSubStore.has(
      context,
      query,
    );

    if (!audioExists) {
      throw new Error(`No audio with id ${query.toString('hex')} found.`);
    }

    const audioData = await audioSubStore.get(
      context,
      query,
    );
    const audioJSON: AudioJSON = codec.toJSON(audioStoreSchema, audioData);
    return audioJSON;
  }
}
