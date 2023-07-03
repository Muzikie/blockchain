// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { ProfileCreatedEventData } from '../types';
import { profileCreatedEventDataSchema } from '../schemas';

export class ProfileCreated extends BaseEvent<ProfileCreatedEventData> {
  public schema = profileCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: ProfileCreatedEventData): void {
    this.add(ctx, data, [
      data.creatorAddress,
      data.profileID,
    ]);
  }
}
