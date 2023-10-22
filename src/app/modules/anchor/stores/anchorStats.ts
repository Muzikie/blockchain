// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { AnchorStats } from '../types';
import { anchorStatsSchema } from '../schemas';

export class AnchorStatsStore extends BaseStore<AnchorStats> {
  public schema = anchorStatsSchema;
}
