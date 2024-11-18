import { getContributionIdProps, getCampaignIdProps } from './types';

export const getCampaignId = ({ apiId, address }: getCampaignIdProps): Buffer =>
	Buffer.concat([Buffer.from(String(apiId), 'hex'), address]);

export const getContributionId = ({
	campaignId,
	address,
	tierId,
}: getContributionIdProps): Buffer =>
	Buffer.concat([Buffer.from(`${campaignId}:${tierId}`, 'hex'), address]);
