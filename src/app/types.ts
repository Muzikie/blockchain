export interface Transaction<T> {
  nonce: BigInt;
  fee: BigInt;
  senderPublicKey: Buffer;
  params: T;
  id: Buffer;
  signatures: Buffer[];
}
