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
import { address } from '@liskhq/lisk-cryptography';
import { AnchorStore } from '../stores/anchor';
import { AnchorAccountStore } from '../stores/anchorAccount';
import { VoteCommandParams, AnchorAccount, Anchor, EventWinnerData } from '../types';
import { voteCommandParamsSchema } from '../schemas';
import { CONTRIBUTION_FEE, VOTE_RATE_LIMIT } from '../constants';
import { getCreatedAt } from '../../../utils';
import { TREASURY_ADDRESS } from '../../../constants';
import { BadgeMethod } from '../../badge/method';
import { AnchorStatsStore } from '../stores/anchorStats';
import { AnchorVoted } from '../events/anchorVoted';
import { BADGE_PRIZE_PERCENTAGE } from '../../badge/constants';

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

    const anchor = await anchorStore.get(context, anchorID);
    // Cant vote for your own anchor
    if (Buffer.compare(anchor.submitter, senderAddress) === 0) {
      throw new Error(`You can't vote for your own anchor,anchor creator: ${anchor.submitter.toString('hex')}`);
    }

    // Throw error if already voted
    if (anchor.votes.includes(senderAddress)) {
      throw new Error(`You have already voted for anchor with ID ${anchorID.toString('hex')}`);
    }

    // Add vote rate limit
    const senderExists = await anchorAccountStore.has(context, senderAddress);
    if (senderExists) {
      const senderAccount = await anchorAccountStore.get(context, senderAddress);
      const IDS = senderAccount.votes.slice(-1 * VOTE_RATE_LIMIT);

      if (IDS.length >= VOTE_RATE_LIMIT) {
        const thresholdAnchor = await anchorStore.get(context, IDS[0]);

        if (thresholdAnchor.createdAt === getCreatedAt(new Date())) {
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
    const anchorStatsStore = this.stores.get(AnchorStatsStore);

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
    const updatedAnchor: Anchor = {
      ...anchorNFT,
      votes: [...anchorNFT.votes, senderAddress],
    };
    // Save anchor object on the blockchain
    await anchorStore.set(context, anchorID, updatedAnchor);

    const anchorStats = await anchorStatsStore.get(context, Buffer.from(anchorNFT.createdAt));
    anchorStats.votesCount += 1;
    await anchorStatsStore.set(context, Buffer.from(anchorNFT.createdAt), anchorStats);

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
    const winners = await this._badgeMethod.getWinningAnchorsForDate(methodContext, anchorNFT.createdAt);
    const blankSpot = winners.findIndex(item => !item.anchorID.length);
    let updatedWinners = winners;
    const anchorExists = updatedWinners.some(winner => winner.anchorID.equals(anchorID));

    if (blankSpot > -1 && !anchorExists) {
      updatedWinners[blankSpot] = { 
        anchorID,
        awardedTo: anchorNFT.submitter ,
      };
    } else {
      // Get anchors for winningIDs
      const winningAnchors = await Promise.all(
        winners.map(async(winner) => winner.anchorID.length ? anchorStore.get(context, winner.anchorID) : null)
      );
      if (!anchorExists) {
        winningAnchors.push(updatedAnchor);
      }
      // Compare votes and place updatedAnchor in correct position
      updatedWinners = winningAnchors
        .sort((a, b) => (b?.votes?.length ?? 0) - (a?.votes?.length ?? 0))
        .slice(0,3)
        .map(item => ({
          anchorID: item?.id ?? Buffer.from(''),
          awardedTo: item?.submitter ?? Buffer.from(''),
        }));
    }

    await this._badgeMethod.updateBadgesForDate(
      methodContext,
      anchorNFT.createdAt,
      updatedWinners,
    );

    const eventDate: EventWinnerData[] = updatedWinners.map((item, index) => ({
      anchorID: item.anchorID,
      awardedTo: address.getLisk32AddressFromAddress(item.awardedTo),
      prize: (BigInt(anchorStats.votesCount) * CONTRIBUTION_FEE * BADGE_PRIZE_PERCENTAGE[index]) / BigInt(100),
    }))

    const anchorVoted = this.events.get(AnchorVoted);
    anchorVoted.add(
      context,
      { updatedWinners: eventDate },
      [context.transaction.senderAddress],
    );
  }
}
