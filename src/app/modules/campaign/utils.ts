import md5 from 'md5';
import { CreateCommandParams } from './types';

export const getCampaignId = ({ apiId }: CreateCommandParams): Buffer =>
	Buffer.concat([Buffer.from(md5(String(apiId), { asString: true }), 'hex')]);
