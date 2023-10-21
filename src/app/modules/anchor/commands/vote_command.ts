/* eslint-disable import/no-extraneous-dependencies */
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
import { ModuleEndpointContext } from 'lisk-framework';
import { AnchorStore } from '../stores/anchor';
import { AnchorAccountStore } from '../stores/anchorAccount';
import { VoteCommandParams, AnchorAccount, Anchor } from '../types';
import { voteCommandParamsSchema } from '../schemas';
import { CONTRIBUTION_FEE, VOTE_RATE_LIMIT } from '../constants';
import { getCreatedAt } from '../utils';
import { TREASURY_ADDRESS } from '../../../constants';
import { BadgeMethod } from '../../badge/method';
import { UpdatedWinningAnchor } from '../../badge/types';

export class VoteCommand extends BaseCommand {
  public schema = voteCommandParamsSchema;
  private _tokenMethod!: TokenMethod;
  private _badgeMethod!: BadgeMethod;

  public addDependencies(tokenMethod: TokenMethod, badgeMethod: BadgeMethod) {
    this._tokenMethod = tokenMethod;
    this._badgeMethod = badgeMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<VoteCommandParams>,
  ): Promise<VerificationResult> {
    const {
      params: { anchorID },
      transaction: { senderAddress },
    } = context;
    const anchorStore = this.stores.get(AnchorStore);
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    // Throw if anchor didn't exist
    const anchorExists = await anchorStore.has(context, anchorID);
    if (!anchorExists) {
      throw new Error(`Anchor with ID ${anchorID.toString('hex')} does not exist`);
    }

    // Throw error if already voted
    const anchor = await anchorStore.get(context, anchorID);
    if (anchor.votes.includes(senderAddress)) {
      throw new Error(`You have already voted for anchor with ID ${anchorID.toString('hex')}`);
    }

    // Add vote rate limit
    const senderExists = await anchorAccountStore.has(context, senderAddress);
    if(senderExists) {
      const senderAccount = await anchorAccountStore.get(context, senderAddress);
      const IDS = senderAccount.votes.slice(-1 * VOTE_RATE_LIMIT);

      if(IDS.length >= VOTE_RATE_LIMIT) {
        const thresholdAnchor = await anchorStore.get(context, IDS[0]);

        if (thresholdAnchor.createdAt === getCreatedAt(Math.floor(((new Date()).getTime())))) {
          throw new Error(`You have exceeded the ${VOTE_RATE_LIMIT} vote submissions daily limit.`);
        }
      }
    }

    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<VoteCommandParams>): Promise<void> {
    const {
      params: { anchorID },
      transaction: { senderAddress },
      chainID,
    } = context;
    const tokenID = Buffer.concat([chainID, Buffer.alloc(4)]);
    const methodContext = context.getMethodContext();
    const anchorAccountStore = this.stores.get(AnchorAccountStore);
    const anchorStore = this.stores.get(AnchorStore);

    // Get anchor from the blockchain and add the sender address to the votes
    const anchorNFT: Anchor = await anchorStore.get(context, anchorID);

    // Collect the contribution fee
    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      TREASURY_ADDRESS,
      tokenID,
      CONTRIBUTION_FEE,
    );

    // Create anchor object
    const updatedAnchor = {
      ...anchorNFT,
      votes: [...anchorNFT.votes, senderAddress],
    };
    // Save anchor object on the blockchain
    await anchorStore.set(context, anchorID, updatedAnchor);

    // Add owned anchor and save the anchor on the sender account
    const senderExist = await anchorAccountStore.has(context, senderAddress);
    let senderAccount: AnchorAccount;
    if (senderExist) {
      senderAccount = await anchorAccountStore.get(context, senderAddress);
      senderAccount.votes = [...senderAccount.votes, anchorID];
    } else {
      senderAccount = {
        anchors: [],
        votes: [anchorID],
      };
    }
    await anchorAccountStore.set(context, senderAddress, senderAccount);

    // Determine which badge the sender should be assigned to.
    const winningIDs = await this._badgeMethod.getWinningAnchorsForDate(methodContext as unknown as ModuleEndpointContext, anchorNFT.createdAt);

    // get anchors for winningIDs
    const winningAnchors: Anchor[] = await Promise.all(
      winningIDs.map(async (id) => anchorStore.get(context, id)),
    );

    // Compare votes and place updatedAnchor in correct position
    const updatedWinningIDs: UpdatedWinningAnchor[] = [...winningAnchors, updatedAnchor]
      .sort((a, b) => a.votes.length - b.votes.length)
      .slice(-3)
      .map(item => ({
        anchorID: item.id,
        awardedTo: item.submitter
      }));

    await this._badgeMethod.updateBadgesForDate(methodContext, anchorNFT.createdAt, updatedWinningIDs);
  }
}
