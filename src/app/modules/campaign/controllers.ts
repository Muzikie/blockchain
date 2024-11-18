import { codec } from 'klayr-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Types } from 'klayr-framework';
import { address as cryptoAddress } from '@klayr/cryptography';
import { CampaignAccountJSON, CampaignJSON, Campaign, CampaignAccount, Store } from './types';
import { accountStoreSchema, campaignStoreSchema } from './schemas';

export const getAccount = async (
	context: Types.ModuleEndpointContext,
	campaignAccountStore: Store<CampaignAccount>,
): Promise<CampaignAccountJSON> => {
	const { address } = context.params;

	if (typeof address !== 'string') {
		throw new Error('Parameter address must be a string.');
	}

	const isValidAddress = cryptoAddress.validateKlayr32Address(address);
	if (!isValidAddress) {
		throw new Error('Parameter address must be a valid address.');
	}

	const addressBuffer = cryptoAddress.getAddressFromKlayr32Address(address);

	const accountExists = await campaignAccountStore.has(context, addressBuffer);

	if (!accountExists) {
		throw new Error(`No account with address ${address} found.`);
	}

	const accountData = await campaignAccountStore.get(context, addressBuffer);
	const accountJSON: CampaignAccountJSON = codec.toJSON(accountStoreSchema, accountData);
	return accountJSON;
};

export const getCampaign = async (
	context: Types.ModuleEndpointContext,
	campaignStore: Store<Campaign>,
): Promise<CampaignJSON> => {
	const { campaignId } = context.params;

	let query: Buffer;

	if (Buffer.isBuffer(campaignId)) {
		query = campaignId;
	} else if (typeof campaignId === 'string') {
		query = Buffer.from(campaignId, 'hex');
	} else {
		throw new Error('Parameter campaignId must be a string or a buffer.');
	}

	const campaignExists = await campaignStore.has(context, query);

	if (!campaignExists) {
		throw new Error(`No campaign with id ${query.toString('hex')} found.`);
	}

	const campaignData = await campaignStore.get(context, query);
	const campaignJSON: CampaignJSON = codec.toJSON(campaignStoreSchema, campaignData);
	return campaignJSON;
};
