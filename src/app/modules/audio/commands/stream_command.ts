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
import { StreamCommandParams, Audio } from '../types';
import { validGenres, MIN_RELEASE_YEAR } from '../constants';

export class StreamCommand extends BaseCommand {
  public schema = streamCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(_context: CommandVerifyContext<StreamCommandParams>): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(_context: CommandExecuteContext<StreamCommandParams>): Promise<void> {
    // Throw an error if audio does not exist
    // Throw an error if the sender is not a member of an existing subscription
    // Throw error if the corresponding subscription consumable is zero
    // Increment the corresponding subscription streams count
    // Decrement the corresponding subscription consumable
    // Increment the corresponding audio streams count
    // Increment the corresponding audio income value
    // Store stream object in the streams store
  }
}
