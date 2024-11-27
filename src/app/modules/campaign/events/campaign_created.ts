/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignCreatedEventData } from '../types';
import { campaignCreatedEventDataSchema } from '../schemas';

export class CampaignCreated extends Modules.BaseEvent<CampaignCreatedEventData> {
	public schema = campaignCreatedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: CampaignCreatedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
