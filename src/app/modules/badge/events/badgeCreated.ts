/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { BadgeCreatedEventData } from '../types';
import { badgeCreatedEventDataSchema } from '../schemas';

export class BadgeCreated extends BaseEvent<BadgeCreatedEventData> {
  public schema = badgeCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: BadgeCreatedEventData): void {
    this.add(ctx, data, [
      data.creatorAddress,
      data.badgeID,
    ]);
  }
}
