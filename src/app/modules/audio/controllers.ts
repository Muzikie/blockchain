import { codec } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { AudioAccountJSON, AudioJSON, Audio, Store, AudioAccount } from './types';
import { accountStoreSchema, audioStoreSchema } from './schemas';

export const getAccount = async (context: ModuleEndpointContext, audioAccountSubStore: Store<AudioAccount>): Promise<AudioAccountJSON> => {
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

export const getAudio = async (context: ModuleEndpointContext, audioSubStore: Store<Audio>): Promise<AudioJSON> => {
  const { audioID } = context.params;

  let query: Buffer;

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
