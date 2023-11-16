// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Anchor } from '../types';
import { anchorStoreSchema } from '../schemas';

export class AnchorStore extends BaseStore<Anchor> {
  public schema = anchorStoreSchema;
}
