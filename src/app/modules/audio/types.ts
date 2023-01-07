// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface LoyaltyOwner {
  address: Buffer;
  shares: number;
  income: bigint;
}

export interface LoyaltyOwnerJSON {
  address: string;
  shares: number;
  income: string;
}

export interface Audio {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  collectionID: Buffer;
  creatorAddress: Buffer;
  owners: LoyaltyOwner[];
  hash: Buffer;
  meta: Buffer;
}

export interface AudioJSON {
  creatorAddress: string;
  name: string;
  releaseYear: number;
  artistName: string;
  genre: number[];
  collectionID: string;
  owners: LoyaltyOwnerJSON[];
  hash: string;
  meta: string;
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
  owners: Omit<LoyaltyOwner, 'income'>[];
  hash: Buffer;
  meta: Buffer;
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

export interface StreamCommandParams {
  audioID: Buffer;
}

export interface ReclaimCommandParams {
  id: Buffer;
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

export interface Genre {
  name: string;
  id: number;
}

export interface Success {
  success: boolean;
}
