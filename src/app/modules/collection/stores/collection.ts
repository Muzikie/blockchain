// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Collection } from '../types';
import { collectionStoreSchema } from '../schemas';

export class CollectionStore extends BaseStore<Collection> {
  public schema = collectionStoreSchema;
}
