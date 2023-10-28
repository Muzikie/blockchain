/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { AnchorVotedEventData } from '../types';
import { anchorVotedEventDataSchema } from '../schemas';

export class AnchorVoted extends BaseEvent<AnchorVotedEventData> {
  public schema = anchorVotedEventDataSchema;

  public log(ctx: EventQueuer, data: AnchorVotedEventData): void {
    this.add(ctx, data, [ ]);
  }
}
