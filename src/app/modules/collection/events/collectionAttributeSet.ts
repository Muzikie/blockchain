// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { CollectionAttributeSetEventData } from '../types';
import { collectionAttributeSetEventDataSchema } from '../schemas';

export class CollectionAttributeSet extends BaseEvent<CollectionAttributeSetEventData> {
  public schema = collectionAttributeSetEventDataSchema;

  public log(ctx: EventQueuer, data: CollectionAttributeSetEventData): void {
    this.add(ctx, data, [
      data.creatorAddress,
      data.collectionID,
    ]);
  }
}
