/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { BadgeStore } from '../stores/badge';
import { setAttributesCommandParamsSchema } from '../schemas';
import { SetAttributesCommandParams, Badge } from '../types';
import { VALID_GENRES, MIN_RELEASE_YEAR } from '../constants';

export class SetAttributesCommand extends BaseCommand {
  public schema = setAttributesCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<SetAttributesCommandParams>,
  ): Promise<VerificationResult> {
    const thisYear = new Date().getFullYear();
    const numericYear = Number(context.params.releaseYear);
    if (numericYear < MIN_RELEASE_YEAR || numericYear > thisYear) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error(
          `Release year must be a number between ${MIN_RELEASE_YEAR} and ${thisYear}`,
        ),
      };
    }
    if (context.params.genre.some(item => item > VALID_GENRES.length)) {
      return {
        status: VerifyStatus.FAIL,
        error: new Error('Genres should be selected from the list of valid genres'),
      };
    }
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<SetAttributesCommandParams>): Promise<void> {
    const { params, transaction } = context;
    // Get namehash output of the badge file

    const badgeSubStore = this.stores.get(BadgeStore);

    // Check uniqueness of the NFT
    const badgeExists = await badgeSubStore.has(context, params.badgeID);
    if (!badgeExists) {
      throw new Error('Badge with this ID does not exist.');
    }

    const badgeNFT: Badge = await badgeSubStore.get(context, params.badgeID);

    // Check if the sender owns the badge
    if (!badgeNFT.creatorAddress.equals(transaction.senderAddress)) {
      throw new Error('You cannot update an badge that you do not own.');
    }

    // Create the Badge object and save it on the blockchain
    const updatedObject: Badge = {
      ...params,
      // set income back
      badgeSignature: badgeNFT.badgeSignature,
      badgeHash: badgeNFT.badgeHash,
      owners: badgeNFT.owners,
      creatorAddress: badgeNFT.creatorAddress,
    };
    await badgeSubStore.set(context, params.badgeID, updatedObject);
  }
}
