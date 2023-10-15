// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface Anchor {
  price: bigint;
  consumable: bigint;
  streams: bigint;
  members: Buffer[];
  maxMembers: number;
  creatorAddress: Buffer;
}

export interface AnchorJSON {
  price: string;
  consumable: string;
  streams: string;
  members: string[];
  maxMembers: number;
  creatorAddress: string;
}

export interface AnchorAccount {
  anchor: {
    owned: Buffer[];
    shared: Buffer;
  };
}

export interface AnchorAccountJSON {
  anchor: {
    owned: string[];
    shared: string;
  };
}

export interface CreateCommandParams {
  maxMembers: number;
  price: bigint;
}

export interface PurchaseCommandParams {
  anchorID: Buffer;
  members: Buffer[];
}

export interface UpdateMembersCommandParams {
  anchorID: Buffer;
  members: Buffer[];
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export interface GetByAddressResult {
  anchorID: Buffer;
  data: Anchor;
}

export interface hasAnchorResponse {
  success: boolean;
  message?: string;
}

export enum CreateEventResult {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export interface AnchorCreatedEventData {
  creatorAddress: Buffer;
  anchorID: Buffer;
  consumable: bigint;
  streams: bigint;
}
