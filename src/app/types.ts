export interface Transaction<T> {
  nonce: bigint;
  fee: bigint;
  senderPublicKey: Buffer;
  params: T;
  id: Buffer;
  signatures: Buffer[];
}
