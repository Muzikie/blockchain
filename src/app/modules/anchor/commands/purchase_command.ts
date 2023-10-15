/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
  TokenMethod,
} from 'lisk-sdk';
import { AnchorStore } from '../stores/anchor';
import { AnchorAccountStore } from '../stores/anchorAccount';
import { PurchaseCommandParams, AnchorAccount } from '../types';
import { purchaseCommandParamsSchema } from '../schemas';
import { DEV_ADDRESS, TREASURY_ADDRESS } from '../constants';

export class PurchaseCommand extends BaseCommand {
  public schema = purchaseCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<PurchaseCommandParams>,
  ): Promise<VerificationResult> {
    if (context.params.members?.length === 0) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Define at least one member'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<PurchaseCommandParams>): Promise<void> {
    const {
      params: { members, anchorID },
      transaction: { senderAddress },
      chainID,
    } = context;
    const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
    const methodContext = context.getMethodContext();
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorStore = this.stores.get(AnchorStore);

    // Throw if anchor didn't exist
    const anchorExists = await anchorStore.has(context, anchorID);
    if (!anchorExists) {
      throw new Error(`Anchor with ID ${anchorID.toString('hex')} does not exist`);
    }
    // Get anchor from the blockchain
    const anchorNFT = await anchorStore.get(context, anchorID);
    // Throw error if the members are more than the maximum allowed
    if (members.length > anchorNFT.maxMembers) {
      throw new Error(`The anchor only allows ${anchorNFT.maxMembers} members`);
    }
    // Throw error if the anchor doesn't is already active
    if (!anchorNFT.creatorAddress.equals(DEV_ADDRESS)) {
      throw new Error(`The anchor is already purchased.`);
    }

    // throw an error if the sender does not have enough tokens
    // Deduct the price from the sender account
    // Add 20% of the price to the creator account
    const devCosts = (anchorNFT.price * BigInt(2)) / BigInt(10);
    const consumable = anchorNFT.price - devCosts;

    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      DEV_ADDRESS,
      tokenID,
      devCosts,
    );
    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      TREASURY_ADDRESS,
      tokenID,
      consumable,
    );

    // Create anchor object
    const anchor = {
      ...anchorNFT,
      consumable,
      members,
      creatorAddress: senderAddress,
    };
    // Save anchor object on the blockchain
    await anchorStore.set(context, anchorID, anchor);

    // Add owned anchor and save the anchor on the sender account
    const senderExist = await anchorAccountStore.has(context, senderAddress);
    let senderAccount: AnchorAccount;
    if (senderExist) {
      senderAccount = await anchorAccountStore.get(context, senderAddress);
      senderAccount.anchor.owned = [...senderAccount.anchor.owned, anchorID];
    } else {
      senderAccount = {
        anchor: {
          owned: [anchorID],
          shared: Buffer.alloc(0),
        },
      };
    }

    await anchorAccountStore.set(context, senderAddress, senderAccount);

    // Remove anchor from the dev account
    const devAccount = await anchorAccountStore.get(context, DEV_ADDRESS);
    await anchorAccountStore.set(
      context,
      DEV_ADDRESS,
      {
        anchor: {
          owned: devAccount.anchor.owned.filter(item => !item.equals(anchorID)),
          shared: Buffer.alloc(0),
        },
      },
    );

    // Save the anchor on the members accounts
    for (const member of members) {
      const memberExist = await anchorAccountStore.has(context, member);
      let memberAccount: AnchorAccount;
      if (memberExist) {
        memberAccount = await anchorAccountStore.get(context, member);
        memberAccount.anchor.shared = anchorID;
      } else {
        memberAccount = {
          anchor: {
            owned: [Buffer.alloc(0)],
            shared: anchorID,
          },
        };
      }
      await anchorAccountStore.set(context, member, memberAccount);
    }
  }
}
