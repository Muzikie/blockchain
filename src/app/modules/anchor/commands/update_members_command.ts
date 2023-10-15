/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AnchorStore } from '../stores/anchor';
import { AnchorAccountStore } from '../stores/anchorAccount';
import { UpdateMembersCommandParams, AnchorAccount } from '../types';
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
    const { members, anchorID } = context.params;
    const { senderAddress } = context.transaction;
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
    if (!anchorNFT.creatorAddress.equals(senderAddress)) {
      throw new Error('Only the owner of the anchor can update the members.');
    }

    const oldMembers = anchorNFT.members;

    // Create anchor object
    const anchor = {
      ...anchorNFT,
      members,
    };

    // Save anchor object on the blockchain
    await anchorStore.set(context, anchorID, anchor);

    let addedMembers = [...members];
    // Remove the anchor from the members accounts who are now removed
    for (const oldMember of oldMembers) {
      const unChanged = members.find(item => item.equals(oldMember));
      if (!unChanged) {
        // Remove the anchor ID from the account's shared anchors
        const oldMemberAccount = await anchorAccountStore.get(context, oldMember);
        oldMemberAccount.anchor.shared = Buffer.alloc(0);
        await anchorAccountStore.set(context, oldMember, oldMemberAccount);
      } else {
        addedMembers = addedMembers.filter(item => !item.equals(oldMember));
      }
    }

    // Add anchor ID to the new member accounts
    for (const member of addedMembers) {
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
