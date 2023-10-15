/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { BadgeStreamedEventData } from '../types';
import { badgeStreamedEventDataSchema } from '../schemas';

export class BadgeStreamed extends BaseEvent<BadgeStreamedEventData> {
  public schema = badgeStreamedEventDataSchema;

  public log(ctx: EventQueuer, data: BadgeStreamedEventData): void {
    this.add(ctx, data, [
      data.address,
    ]);
  }
}
