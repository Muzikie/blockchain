/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { ContributionTierAddedEventData } from '../types';
import { contributionTierAddedEventDataSchema } from '../schemas';

export class ContributionTierAdded extends Modules.BaseEvent<ContributionTierAddedEventData> {
	public schema = contributionTierAddedEventDataSchema;

	public log(ctx: Modules.EventQueuer, data: ContributionTierAddedEventData): void {
		this.add(ctx, data, [data.submitter]);
	}
}
