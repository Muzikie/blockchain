// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Audio } from '../types';
import { audioStoreSchema } from '../schemas';

export class AudioStore extends BaseStore<Audio> {
  public schema = audioStoreSchema;
}
