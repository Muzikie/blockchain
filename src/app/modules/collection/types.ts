// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export enum CollectionType {
  ALBUM = 1,
  PODCAST_SERIES = 2,
}

export interface Collection {
  name: string;
  releaseYear: string;
  collectionType: CollectionType;
  audios: Buffer[];
  coverSignature: Buffer;
  coverHash: Buffer;
  creatorAddress: Buffer;
}

export interface CollectionJSON {
  name: string;
  releaseYear: string;
  collectionType: CollectionType;
  audios: string[];
  coverSignature: string;
  coverHash: string;
  creatorAddress: string;
}

export interface CollectionAccount {
  collection: {
    collections: Buffer[];
  };
}

export interface CollectionAccountJSON {
  collection: {
    collections: string[];
  };
}

export interface CreateCommandParams {
  name: string;
  releaseYear: string;
  collectionType: CollectionType;
  coverSignature: Buffer;
  coverHash: Buffer;
}

export interface DestroyCommandParams {
  collectionID: Buffer;
}

export interface TransferCommandParams {
  collectionID: Buffer;
  address: Buffer;
}

export interface SetAttributesCommandParams {
  name: string;
  releaseYear: string;
  collectionType: CollectionType;
  collectionID: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export interface CollectionCreatedEventData {
  creatorAddress: Buffer;
  collectionID: Buffer;
}
