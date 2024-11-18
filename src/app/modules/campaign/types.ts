// eslint-disable-next-line import/no-extraneous-dependencies
import { Types } from 'klayr-framework';

export enum CampaignStatus {
	Draft = 'Draft',
	Published = 'Published',
	Successful = 'Successful',
	SoldOut = 'SoldOut',
	Failed = 'Failed',
	Failing = 'Failing',
	Withdrawn = 'Withdrawn',
}

export interface ContributionTier {
	apiId: number;
	amount: bigint;
}

export interface ContributionTierJSON {
	apiId: number;
	amount: string;
}

export interface Campaign {
	softGoal: bigint;
	hardGoal: bigint;
	currentFunding: bigint;
	status: CampaignStatus;
	deadline: string;
	submitter: Buffer;
	apiId: number;
	contributionTiers: ContributionTier[];
	id: Buffer;
}

export interface CampaignJSON {
	softGoal: string;
	hardGoal: string;
	deadline: string;
	currentFunding: string;
	status: CampaignStatus;
	submitter: string;
	apiId: number;
	contributionTiers: ContributionTierJSON[];
	id: string;
}

export interface CampaignAccount {
	campaigns: Buffer[];
}

export interface CampaignAccountJSON {
	campaigns: string[];
}

export interface Contribution {
	tierId: number;
	campaignId: Buffer;
	amount: bigint;
	address: Buffer;
}

export interface ContributionJSON {
	tierId: number;
	campaignId: number;
	amount: string;
	address: string;
}

export interface AddTierCommandParams {
	amount: string;
	apiId: number;
	campaignId: string;
}

export interface PublishCommandParams {
	campaignId: string;
}

export interface PayoutCommandParams {
	campaignId: string;
}

export interface CreateCommandParams {
	softGoal: string;
	hardGoal: string;
	deadline: string;
	apiId: number;
}

export interface ContributeCommandParams {
	campaignId: string;
	tierId: number;
}

export interface Store<Entity> {
	get: (context: Types.ModuleEndpointContext, key: Buffer) => Promise<Entity>;
	has: (context: Types.ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export enum CreateEventResult {
	Successful = 'successful',
	Failed = 'failed',
}

export interface getContributionIdProps {
	campaignId: string;
	tierId: number;
	address: Buffer;
}

export interface getCampaignIdProps {
	apiId: number;
}

export interface CampaignCreatedEventData {
	submitter: Buffer;
	campaignId: Buffer;
}

export interface ContributionTierAddedEventData {
	submitter: Buffer;
	campaignId: Buffer;
}

export interface CampaignPublishedEventData {
	submitter: Buffer;
	campaignId: Buffer;
}

export interface ContributionProcessedEventData {
	submitter: Buffer;
	campaignId: Buffer;
	updatedFunding: bigint;
}

export interface CampaignPayoutProcessedEventData {
	submitter: Buffer;
	campaignId: Buffer;
	amount: bigint;
}
