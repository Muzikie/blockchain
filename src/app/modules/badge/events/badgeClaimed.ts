/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { BadgeClaimedEventData } from '../types';
import { BadgeClaimedEventDataSchema } from '../schemas';

export class BadgeClaimed extends BaseEvent<BadgeClaimedEventData> {
  public schema = BadgeClaimedEventDataSchema;

  public log(ctx: EventQueuer, data: BadgeClaimedEventData): void {
    this.add(ctx, data, [
      data.address,
    ]);
  }
}
