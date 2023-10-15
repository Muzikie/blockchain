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
import { streamCommandParamsSchema } from '../schemas';
import { StreamCommandParams } from '../types';
import { Anchor } from '../../anchor/types'
import { STREAM_COST } from '../constants';
import { AnchorMethod } from '../../anchor/method';
import { BadgeStreamed } from '../events/badgeStreamed';

export class StreamCommand extends BaseCommand {
  public schema = streamCommandParamsSchema;
  private _anchorMethod!: AnchorMethod;

  public addDependencies(anchorMethod: AnchorMethod) {
    this._anchorMethod = anchorMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    _context: CommandVerifyContext<StreamCommandParams>,
  ): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<StreamCommandParams>): Promise<void> {
    const {
      params: { badgeID },
      transaction: { senderAddress },
    } = context;
    const methodContext = context.getMethodContext();
    const badgeSubStore = this.stores.get(BadgeStore);

    // Throw an error if badge does not exist
    const badgeExists = await badgeSubStore.has(context, badgeID);
    if (!badgeExists) {
      throw new Error(`Badge with ID ${badgeID.toString('hex')} does not exist.`);
    }
    const badge = await badgeSubStore.get(context, badgeID);

    // Throw an error if the sender is not a member of an existing anchor
    let anchor: Anchor;
    let anchorID: Buffer;
    try {
      const result = await this._anchorMethod.getByAddress(
        methodContext,
        senderAddress,
      );
      anchor = result.data;
      anchorID = result.anchorID;
    } catch (e) {
      throw new Error('Account is not a member of an existing anchor.');
    }


    // Increment the corresponding anchor streams count
    anchor.streams += BigInt(1);
    // Decrement the corresponding anchor consumable
    anchor.consumable -= STREAM_COST; // @todo include fee

    // Increment the corresponding badge income value for each owner based on their shares %
    badge.owners = badge.owners.map((owner, index) => ({
      address: owner.address,
      shares: owner.shares,
      income: badge.owners[index].income + (STREAM_COST * BigInt(owner.shares)) / BigInt(100),
    }));

    // Store stream object in the streams store
    await badgeSubStore.set(context, badgeID, badge);

    // Store anchor object in the anchors store
    await this._anchorMethod.consume(methodContext, anchorID, senderAddress);

    // Emit a "New collection" event
    const badgeStreamed = this.events.get(BadgeStreamed);
    badgeStreamed.add(context, {
      address: context.transaction.senderAddress,
      owners: badge.owners,
    }, [context.transaction.senderAddress]);
  }
}
