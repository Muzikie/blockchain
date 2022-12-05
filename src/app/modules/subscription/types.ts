export interface Subscription {
  price: bigint;
  consumable: bigint;
  streams: bigint;
  members: Buffer[];
  creatorAddress: Buffer;
}
