/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignPublishedEventData } from '../types';
import { campaignPublishedEventDataSchema } from '../schemas';

export class CampaignPublished extends Modules.BaseEvent<CampaignPublishedEventData> {
	public schema = campaignPublishedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: CampaignPublishedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
