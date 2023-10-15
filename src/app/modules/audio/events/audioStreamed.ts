/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { AudioStreamedEventData } from '../types';
import { audioStreamedEventDataSchema } from '../schemas';

export class AudioStreamed extends BaseEvent<AudioStreamedEventData> {
  public schema = audioStreamedEventDataSchema;

  public log(ctx: EventQueuer, data: AudioStreamedEventData): void {
    this.add(ctx, data, [
      data.address,
    ]);
  }
}
