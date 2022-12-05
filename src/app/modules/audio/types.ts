// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

interface LoyaltyOwner {
  address: Buffer;
  shares: number;
}

interface LoyaltyOwnerJSON {
  address: string;
  shares: number;
}

export interface Audio {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  collectionID: Buffer;
  creatorAddress: Buffer;
  owners: LoyaltyOwner[];
}

export interface AudioJSON {
  creatorAddress: string;
  name: string;
  releaseYear: number;
  artistName: string;
  genre: number[];
  collectionID: string;
  owners: LoyaltyOwnerJSON[];
}

export interface AudioAccount {
  audio: {
    audios: Buffer[];
  };
}

export interface AudioAccountJSON {
  audio: {
    audios: string[];
  };
}

export interface CreateCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  collectionID: Buffer;
  owners: LoyaltyOwner[];
}

export interface DestroyCommandParams {
  audioID: Buffer;
}

export interface TransferCommandParams {
  audioID: Buffer;
  address: Buffer;
  shares: number;
}

export interface SetAttributesCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  collectionID: Buffer;
  audioID: Buffer;
}

export interface Store<Entity> {
  get:  (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export enum CreateEventResult {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export interface CreateEventData {
  senderAddress: Buffer;
  audioID: Buffer;
}
