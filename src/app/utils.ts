import { createHash } from 'crypto';
import { ed } from '@liskhq/lisk-cryptography';
import { codec } from '@liskhq/lisk-codec';
import { Transaction } from './types';
import { baseTransactionSchema } from './schemas';

export const getEntityID = <T>(transaction: Transaction<T>): Buffer => {
  const txBytes = codec.encode(baseTransactionSchema, transaction);
  return createHash('md5').update(txBytes).digest();
};

export const verifyHash = (signature: Buffer, message: Buffer, publicKey: Buffer) => {
  let isCorrect = false;

  try {
    isCorrect = ed.verifyMessageWithPublicKey({
      message: message.toString('hex'),
      publicKey,
      signature,
    });
  } catch (e) {
    isCorrect = false;
  }
  return isCorrect;
};
