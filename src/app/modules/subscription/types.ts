export interface Subscription {
  price: bigint;
  consumable: bigint;
  streams: bigint;
  members: Buffer[];
  maxMembers: number;
  creatorAddress: Buffer;
}

export interface SubscriptionAccount {
  subscription: {
    owned: Buffer[];
    shared: Buffer;
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
