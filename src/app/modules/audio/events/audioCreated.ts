/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { AudioCreatedEventData } from '../types';
import { audioCreatedEventDataSchema } from '../schemas';

export class AudioCreated extends BaseEvent<AudioCreatedEventData> {
  public schema = audioCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: AudioCreatedEventData): void {
    this.add(ctx, data, [
      data.creatorAddress,
      data.audioID,
    ]);
  }
}
