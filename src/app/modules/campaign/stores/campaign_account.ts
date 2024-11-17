// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignAccount } from '../types';
import { accountStoreSchema } from '../schemas';

export class CampaignAccountStore extends Modules.BaseStore<CampaignAccount> {
	public schema = accountStoreSchema;
}
