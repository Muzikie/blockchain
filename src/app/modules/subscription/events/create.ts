// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { CreateEventResult, CreateEventData } from '../types';
import { creationEventSchema } from '../schemas';

export class SubscriptionCreated extends BaseEvent<CreateEventData & { result: CreateEventResult }> {
  public schema = creationEventSchema;

  public log(ctx: EventQueuer, data: CreateEventData): void {
    this.add(ctx, { ...data, result: CreateEventResult.SUCCESSFUL }, [
      data.senderAddress,
      data.subscriptionID,
    ]);
  }
}
