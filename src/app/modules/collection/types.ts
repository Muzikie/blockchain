// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface Collection {
  name: string;
  releaseYear: string;
  collectionType: number;
  audios: Buffer[];
  coverSignature: Buffer;
  coverHash: Buffer;
  creatorAddress: Buffer;
}

export interface CollectionJSON {
  name: string;
  releaseYear: string;
  collectionType: number;
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
  collectionType: number;
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
  collectionType: number;
  collectionID: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}
