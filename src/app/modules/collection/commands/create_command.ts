/* eslint-disable class-methods-use-this */
import {
  BaseCommand,
  CommandVerifyContext,
  CommandExecuteContext,
  VerificationResult,
  VerifyStatus,
} from 'lisk-sdk';
import { CreateCommandParams } from '../types';
import { createCommandParamsSchema } from '../schemas';

export class CreateCommand extends BaseCommand {
  public schema = createCommandParamsSchema;

  // eslint-disable-next-line @typescript-eslint/require-await
  public async verify(_context: CommandVerifyContext<CreateCommandParams>): Promise<VerificationResult> {
    return { status: VerifyStatus.OK };
  }

  public async execute(_context: CommandExecuteContext<CreateCommandParams>): Promise<void> {}
}
