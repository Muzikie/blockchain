/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { AnchorCreatedEventData } from '../types';
import { anchorCreatedEventDataSchema } from '../schemas';

export class AnchorCreated extends BaseEvent<AnchorCreatedEventData> {
  public schema = anchorCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: AnchorCreatedEventData): void {
    this.add(ctx, data, [ data.creatorAddress ]);
  }
}
