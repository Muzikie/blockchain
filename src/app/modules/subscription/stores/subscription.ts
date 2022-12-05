// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseStore } from 'lisk-framework';
import { Subscription } from "../types";
import { subscriptionStoreSchema } from "../schemas";

export class SubscriptionStore extends BaseStore<Subscription> {
	public schema = subscriptionStoreSchema;
}
