// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { Campaign } from '../types';
import { campaignStoreSchema } from '../schemas';

export class CampaignStore extends Modules.BaseStore<Campaign> {
	public schema = campaignStoreSchema;
}
