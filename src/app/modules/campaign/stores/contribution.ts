// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { Contribution } from '../types';
import { contributionStoreSchema } from '../schemas';

export class ContributionStore extends Modules.BaseStore<Contribution> {
	public schema = contributionStoreSchema;
}
