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
import { VoteCommandParams, AnchorAccount } from '../types';
import { voteCommandParamsSchema } from '../schemas';
import { DEV_ADDRESS, TREASURY_ADDRESS, CONTRIBUTION_FEE } from '../constants';

export class VoteCommand extends BaseCommand {
  public schema = voteCommandParamsSchema;
  private _tokenMethod!: TokenMethod;

  public addDependencies(tokenMethod: TokenMethod) {
    this._tokenMethod = tokenMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    context: CommandVerifyContext<VoteCommandParams>,
  ): Promise<VerificationResult> {
    const {
      params: { anchorID },
    } = context;
    const anchorStore = this.stores.get(AnchorStore);
    // Throw if anchor didn't exist
    const anchorExists = await anchorStore.has(context, anchorID);
    if (!anchorExists) {
      throw new Error(`Anchor with ID ${anchorID.toString('hex')} does not exist`);
    }

    // @todo Throw error if already voted

    // @todo Add vote rate limit

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
    const anchorNFT = await anchorStore.get(context, anchorID);

    // Collect the contribution fee
    await this._tokenMethod.transfer(
      methodContext,
      senderAddress,
      DEV_ADDRESS,
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
  }
}
