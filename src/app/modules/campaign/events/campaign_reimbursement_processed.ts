/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignReimbursedEventData } from '../types';
import { campaignReimbursementProcessedEventDataSchema } from '../schemas';

export class CampaignReimbursementProcessed extends Modules.BaseEvent<CampaignReimbursedEventData> {
	public schema = campaignReimbursementProcessedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: CampaignReimbursedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
