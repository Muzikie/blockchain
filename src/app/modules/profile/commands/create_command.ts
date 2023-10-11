/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { ProfileStore } from '../stores/profile';
import { ProfileAccountStore } from '../stores/profileAccount';
import { createCommandParamsSchema } from '../schemas';
import { CreateCommandParams, Profile } from '../types';
import { getEntityID, verifyHash } from '../../../utils';
import { ProfileCreated } from '../events/profileCreated'

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(context: CommandVerifyContext<CreateCommandParams>): Promise<VerificationResult> {
    const { params, transaction } = context;
    // The name and nick name should not be the same
    if (params.name === params.nickName) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('The name and nick name should not be the same'),
      };
    }
    // Validate the signature of the avatar hash
    const isAvatarHashGenuine = verifyHash(params.avatarSignature, params.avatarHash, transaction.senderPublicKey);
    if (!isAvatarHashGenuine) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('The avatar signature is not generated by the sender'),
      };
    }
    // Validate the signature of the banner hash
    const isBannerHashGenuine = verifyHash(params.bannerSignature, params.bannerHash, transaction.senderPublicKey);
    if (!isBannerHashGenuine) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('The banner signature is not generated by the sender'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<CreateCommandParams>): Promise<void> {
    const { params, transaction } = context;

    const profileAccountStore = this.stores.get(ProfileAccountStore);
    const profileStore = this.stores.get(ProfileStore);

    // The name should not be already registered
    const profileAccountExists = await profileAccountStore.has(context, transaction.senderAddress);
    if (profileAccountExists) {
      throw new Error('You have already created a profile for this account.');
    }

    // Get namehash output of the profile NFT
    const profileID = getEntityID(context.transaction);

    // Create the profile account object
    const profileObject: Profile = {
      ...params,
      creatorAddress: transaction.senderAddress,
    };
    // Save the profile account object in account store
    await profileAccountStore.set(context, transaction.senderAddress, {
      profileID,
    });
    // Save the profile object in profile store
    await profileStore.set(context, profileID, profileObject);

    // Emit a "New collection" event
    const profileCreated = this.events.get(ProfileCreated);
    profileCreated.add(context, {
      creatorAddress: context.transaction.senderAddress,
      profileID,
    }, [context.transaction.senderAddress]);
  }
}
