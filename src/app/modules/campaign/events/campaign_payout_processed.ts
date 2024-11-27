/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignPayoutProcessedEventData } from '../types';
import { campaignPayoutProcessedEventDataSchema } from '../schemas';

export class CampaignPayoutProcessed extends Modules.BaseEvent<CampaignPayoutProcessedEventData> {
	public schema = campaignPayoutProcessedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: CampaignPayoutProcessedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
