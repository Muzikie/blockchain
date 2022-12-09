// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface Subscription {
  price: bigint;
  consumable: bigint;
  streams: bigint;
  members: Buffer[];
  maxMembers: number;
  creatorAddress: Buffer;
}

export interface SubscriptionJSON {
  price: string;
  consumable: string;
  streams: string;
  members: string[];
  maxMembers: number;
  creatorAddress: string;
}

export interface SubscriptionAccount {
  subscription: {
    owned: Buffer[];
    shared: Buffer;
  };
}

export interface SubscriptionAccountJSON {
  subscription: {
    owned: string[];
    shared: string;
  };
}

export interface CreateCommandParams {
  maxMembers: number;
  price: bigint;
}

export interface PurchaseCommandParams {
  subscriptionID: Buffer;
  members: Buffer[];
}

export interface UpdateMembersCommandParams {
  subscriptionID: Buffer;
  members: Buffer[];
}

export interface Store<Entity> {
  get:  (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export interface GetByAddressResult {
  subscriptionID: Buffer;
  data: Subscription;
}

export interface hasSubscriptionResponse {
  success: boolean;
  message?: string;
}
