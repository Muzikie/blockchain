import { Modules } from 'klayr-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Types } from 'klayr-framework';
import { CampaignAccountJSON, CampaignJSON, Campaign, CampaignAccount, Store } from './types';
import { CampaignAccountStore } from './stores/campaign_account';
import { CampaignStore } from './stores/campaign';
import { getAccount, getCampaign } from './controllers';

export class CampaignEndpoint extends Modules.BaseEndpoint {
	// Get account by address
	public async getAccount(context: Types.ModuleEndpointContext): Promise<CampaignAccountJSON> {
		const campaignAccountStore = this.stores.get(CampaignAccountStore);
		return getAccount(context, campaignAccountStore as Store<CampaignAccount>);
	}

	// Get Campaign by campaignID
	public async getCampaign(context: Types.ModuleEndpointContext): Promise<CampaignJSON> {
		const campaignStore = this.stores.get(CampaignStore);
		return getCampaign(context, campaignStore as Store<Campaign>);
	}
}
