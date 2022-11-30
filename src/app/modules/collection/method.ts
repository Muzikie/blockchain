import { BaseMethod } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext, MethodContext } from 'lisk-framework';
import {
  CollectionAccountJSON,
  CollectionJSON,
} from './types';
import { CollectionAccountStore } from './stores/collectionAccount';
import { CollectionStore } from './stores/collection';
import { getAccount, getCollection } from './controllers';

export class CollectionMethod extends BaseMethod {
  // Get account by address
  public async getAccount(context: ModuleEndpointContext): Promise<CollectionAccountJSON> {
    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    return getAccount(context, collectionAccountSubStore)
  }

  // Get Collection by collectionID
  public async getCollection(context: ModuleEndpointContext): Promise<CollectionJSON> {
    const collectionSubStore = this.stores.get(CollectionStore);
    return getCollection(context, collectionSubStore);
  }

  // Add newly created audio to the collection
  public async addAudio(context: MethodContext, audioID: Buffer, collectionID: Buffer , senderAddress: Buffer): Promise<void> {
    const collectionSubStore = this.stores.get(CollectionStore);
    if (!Buffer.isBuffer(collectionID)) {
      throw new Error('Parameter collectionID must be a buffer.');
    }
    if (!Buffer.isBuffer(audioID)) {
      throw new Error('Parameter audioID must be a buffer.');
    }
    if (!Buffer.isBuffer(senderAddress)) {
      throw new Error('Parameter senderAddress must be a buffer.');
    }
  
    const collectionExists = await collectionSubStore.has(
      context,
      collectionID,
    );
  
    if (!collectionExists) {
      throw new Error(`No collection with id ${collectionID.toString('hex')} found.`);
    }
  
    const collectionData = await collectionSubStore.get(
      context,
      collectionID,
    );
  
    if (!collectionData.ownerAddress.equals(senderAddress)) {
      throw new Error('Parameter audioID must be a buffer.');
    }
  
    collectionData.audios.push(audioID);
    await collectionSubStore.set(
      context,
      collectionID,
      collectionData
    );
  }

  // Remove the destroyed audio from the collection
  public async removeAudio(context: MethodContext, audioID: Buffer, collectionID: Buffer , senderAddress: Buffer): Promise<void> {
    const collectionSubStore = this.stores.get(CollectionStore);
    if (!Buffer.isBuffer(collectionID)) {
      throw new Error('Parameter collectionID must be a buffer.');
    }
    if (!Buffer.isBuffer(audioID)) {
      throw new Error('Parameter audioID must be a buffer.');
    }
    if (!Buffer.isBuffer(senderAddress)) {
      throw new Error('Parameter senderAddress must be a buffer.');
    }
  
    const collectionExists = await collectionSubStore.has(
      context,
      collectionID,
    );
  
    if (!collectionExists) {
      throw new Error(`No collection with id ${collectionID.toString('hex')} found.`);
    }
  
    const collectionData = await collectionSubStore.get(
      context,
      collectionID,
    );
  
    if (!collectionData.ownerAddress.equals(senderAddress)) {
      throw new Error('Parameter audioID must be a buffer.');
    }
  
    collectionData.audios = collectionData.audios.filter(item => !item.equals(audioID));
    await collectionSubStore.set(
      context,
      collectionID,
      collectionData
    );
  }
}
