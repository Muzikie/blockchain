/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { ContributionProcessedEventData } from '../types';
import { contributionProcessedEventDataSchema } from '../schemas';

export class ContributionProcessed extends Modules.BaseEvent<ContributionProcessedEventData> {
	public schema = contributionProcessedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: ContributionProcessedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
