/* eslint-disable class-methods-use-this */

import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { AudioStore } from '../stores/audio';
import { streamCommandParamsSchema } from '../schemas';
import { StreamCommandParams } from '../types';
import { STREAM_COST } from '../constants';
import { SubscriptionMethod } from '../../subscription/method';
import { AudioStreamed } from '../events/audioStreamed';

export class StreamCommand extends BaseCommand {
  public schema = streamCommandParamsSchema;
  private _subscriptionMethod!: SubscriptionMethod;

  public addDependencies(subscriptionMethod: SubscriptionMethod) {
    this._subscriptionMethod = subscriptionMethod;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(
    _context: CommandVerifyContext<StreamCommandParams>,
  ): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(context: CommandExecuteContext<StreamCommandParams>): Promise<void> {
    const {
      params: { audioID },
      transaction: { senderAddress },
    } = context;
    const methodContext = context.getMethodContext();
    const audioSubStore = this.stores.get(AudioStore);

    // Throw an error if audio does not exist
    const audioExists = await audioSubStore.has(context, audioID);
    if (!audioExists) {
      throw new Error(`Audio with ID ${audioID.toString('hex')} does not exist.`);
    }
    const audio = await audioSubStore.get(context, audioID);

    // Throw an error if the sender is not a member of an existing subscription
    let subscription = {
      streams: BigInt(0),
      consumable: BigInt(0),
    };
    let subscriptionID;
    try {
      const result = await this._subscriptionMethod.getByAddress(
        methodContext,
        senderAddress,
      );
      subscription = result.data;
      subscriptionID = result.subscriptionID;
    } catch (e) {
      throw new Error('Account is not a member of an existing subscription.');
    }


    // Increment the corresponding subscription streams count
    subscription.streams += BigInt(1);
    // Decrement the corresponding subscription consumable
    subscription.consumable -= STREAM_COST; // @todo include fee

    // @todo Increment the corresponding audio streams count
    // audio.streams += BigInt(1);

    // Increment the corresponding audio income value for each owner based on their shares %
    audio.owners = audio.owners.map((owner, index) => ({
      address: owner.address,
      shares: owner.shares,
      income: audio.owners[index].income + (STREAM_COST * BigInt(owner.shares)) / BigInt(100),
    }));

    // Store stream object in the streams store
    await audioSubStore.set(context, audioID, audio);

    // Store subscription object in the subscriptions store
    await this._subscriptionMethod.consume(methodContext, subscriptionID, senderAddress);

    // Emit a "New collection" event
    const audioStreamed = this.events.get(AudioStreamed);
    audioStreamed.add(context, {
      address: context.transaction.senderAddress,
      owners: audio.owners,
    }, [context.transaction.senderAddress]);
  }
}
