// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { SubscriptionCreatedEventData } from '../types';
import { subscriptionCreatedEventDataSchema } from '../schemas';

export class SubscriptionCreated extends BaseEvent<SubscriptionCreatedEventData> {
  public schema = subscriptionCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: SubscriptionCreatedEventData): void {
    this.add(ctx, data, [ data.creatorAddress ]);
  }
}
