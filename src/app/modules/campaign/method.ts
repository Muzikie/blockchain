import { Modules } from 'klayr-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Types } from 'klayr-framework';
import { CampaignAccountJSON, CampaignJSON } from './types';
import { CampaignAccountStore } from './stores/campaign_account';
import { CampaignStore } from './stores/campaign';
import { getAccount, getCampaign } from './controllers';

export class CampaignMethod extends Modules.BaseMethod {
	// Get account by address
	public async getAccount(context: Types.ModuleEndpointContext): Promise<CampaignAccountJSON> {
		const campaignAccountStore = this.stores.get(CampaignAccountStore);
		return getAccount(context, campaignAccountStore);
	}

	// Get Campaign by campaignID
	public async getCampaign(context: Types.ModuleEndpointContext): Promise<CampaignJSON> {
		const campaignStore = this.stores.get(CampaignStore);
		return getCampaign(context, campaignStore);
	}
}
