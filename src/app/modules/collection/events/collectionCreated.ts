/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { CollectionCreatedEventData } from '../types';
import { collectionCreatedEventDataSchema } from '../schemas';

export class CollectionCreated extends BaseEvent<CollectionCreatedEventData> {
  public schema = collectionCreatedEventDataSchema;

  public log(ctx: EventQueuer, data: CollectionCreatedEventData): void {
    this.add(ctx, data, [ data.creatorAddress ]);
  }
}
