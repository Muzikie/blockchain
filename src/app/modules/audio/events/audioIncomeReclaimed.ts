/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { AudioIncomeReclaimedEventData } from '../types';
import { AudioIncomeReclaimedEventDataSchema } from '../schemas';

export class AudioIncomeReclaimed extends BaseEvent<AudioIncomeReclaimedEventData> {
  public schema = AudioIncomeReclaimedEventDataSchema;

  public log(ctx: EventQueuer, data: AudioIncomeReclaimedEventData): void {
    this.add(ctx, data, [
      data.address,
    ]);
  }
}
