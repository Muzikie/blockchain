// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Badge } from '../types';
import { badgeStoreSchema } from '../schemas';

export class BadgeStore extends BaseStore<Badge> {
  public schema = badgeStoreSchema;
}
