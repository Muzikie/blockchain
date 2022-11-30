/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { CollectionStore } from '../stores/collection';
import { CollectionAccountStore } from '../stores/collectionAccount';
import { TransferCommandParams, CollectionAccount } from '../types';
import { transferCommandParamsSchema } from '../schemas';

export class TransferCommand extends BaseCommand {
  public schema = transferCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(_context: CommandVerifyContext<TransferCommandParams>): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<TransferCommandParams>): Promise<void> {
    const collectionAccountSubStore = this.stores.get(CollectionAccountStore);
    const collectionSubStore = this.stores.get(CollectionStore);

    // Get collection NFT and both accounts from substores
    const { address, collectionID } = context.params;
    const collectionExists = await collectionSubStore.has(context, collectionID);

    if (!collectionExists) {
      throw new Error('Audio NFT does not exist.');
    }

    const collectionNFT = await collectionSubStore.get(context, collectionID);

    if (!collectionNFT.ownerAddress.equals(context.transaction.senderAddress)) {
      throw new Error('You are not the owner of this collection.');
    }

    const collectionAccount = await collectionAccountSubStore.get(context, collectionNFT.ownerAddress);
    const recipientExists = await collectionAccountSubStore.has(context, address);

    // Find and remove the collectionID from the owner account
    const collectionIndex = collectionAccount.collection.collections.findIndex(id => id.equals(collectionID));
    if (collectionIndex === -1) {
      throw new Error('Collection not found in the sender account.');
    }
    collectionAccount.collection.collections.splice(collectionIndex, 1);

    // Add the collectionID to the recipient account
    collectionNFT.ownerAddress = address;
    if (recipientExists) {
      const recipientAccount = await collectionAccountSubStore.get(context, address);
      recipientAccount.collection.collections.push(collectionID);
      await collectionAccountSubStore.set(context, address, recipientAccount);
    } else {
      const recipientAccount: CollectionAccount = {
        collection: {
          collections: [collectionID],
        }
      };
      await collectionAccountSubStore.set(context, address, recipientAccount);
    }

    // Update the sender account on the blockchain
    await collectionAccountSubStore.set(context, context.transaction.senderAddress, collectionAccount);
    // Update the NFT token on the blockchain
    await collectionSubStore.set(context, collectionID, collectionNFT);
  }
}
