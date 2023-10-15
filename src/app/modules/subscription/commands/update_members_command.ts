/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { SubscriptionStore } from '../stores/subscription';
import { SubscriptionAccountStore } from '../stores/subscriptionAccount';
import { UpdateMembersCommandParams, SubscriptionAccount } from '../types';
import { updateMembersCommandParamsSchema } from '../schemas';

export class UpdateMembersCommand extends BaseCommand {
  public schema = updateMembersCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<UpdateMembersCommandParams>,
  ): Promise<VerificationResult> {
    if (context.params.members?.length === 0) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Define at least one member'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<UpdateMembersCommandParams>): Promise<void> {
    const { members, subscriptionID } = context.params;
    const { senderAddress } = context.transaction;
    const subscriptionAccountStore = this.stores.get(SubscriptionAccountStore);
    const subscriptionStore = this.stores.get(SubscriptionStore);

    // Throw if subscription didn't exist
    const subscriptionExists = await subscriptionStore.has(context, subscriptionID);
    if (!subscriptionExists) {
      throw new Error(`Subscription with ID ${subscriptionID.toString('hex')} does not exist`);
    }
    // Get subscription from the blockchain
    const subscriptionNFT = await subscriptionStore.get(context, subscriptionID);
    // Throw error if the members are more than the maximum allowed
    if (members.length > subscriptionNFT.maxMembers) {
      throw new Error(`The subscription only allows ${subscriptionNFT.maxMembers} members`);
    }
    // Throw error if the subscription doesn't is already active
    if (!subscriptionNFT.creatorAddress.equals(senderAddress)) {
      throw new Error('Only the owner of the subscription can update the members.');
    }

    const oldMembers = subscriptionNFT.members;

    // Create subscription object
    const subscription = {
      ...subscriptionNFT,
      members,
    };

    // Save subscription object on the blockchain
    await subscriptionStore.set(context, subscriptionID, subscription);

    let addedMembers = [...members];
    // Remove the subscription from the members accounts who are now removed
    for (const oldMember of oldMembers) {
      const unChanged = members.find(item => item.equals(oldMember));
      if (!unChanged) {
        // Remove the subscription ID from the account's shared subscriptions
        const oldMemberAccount = await subscriptionAccountStore.get(context, oldMember);
        oldMemberAccount.subscription.shared = Buffer.alloc(0);
        await subscriptionAccountStore.set(context, oldMember, oldMemberAccount);
      } else {
        addedMembers = addedMembers.filter(item => !item.equals(oldMember));
      }
    }

    // Add subscription ID to the new member accounts
    for (const member of addedMembers) {
      const memberExist = await subscriptionAccountStore.has(context, member);
      let memberAccount: SubscriptionAccount;
      if (memberExist) {
        memberAccount = await subscriptionAccountStore.get(context, member);
        memberAccount.subscription.shared = subscriptionID;
      } else {
        memberAccount = {
          subscription: {
            owned: [Buffer.alloc(0)],
            shared: subscriptionID,
          },
        };
      }
      await subscriptionAccountStore.set(context, member, memberAccount);
    }
  }
}
