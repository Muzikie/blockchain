import md5 from 'md5';
import { getContributionIdProps, getCampaignIdProps } from './types';

export const getCampaignId = ({ apiId }: getCampaignIdProps): Buffer =>
	Buffer.from(md5(String(apiId), { asString: true }), 'hex');

export const getContributionId = ({
	campaignId,
	address,
	tierId,
}: getContributionIdProps): Buffer =>
	Buffer.concat([Buffer.from(md5(`${campaignId}:${tierId}`, { asString: true }), 'hex'), address]);
