export const campaignStoreSchema = {
	$id: 'campaign/campaign',
	type: 'object',
	required: ['softGoal', 'hardGoal', 'deadline', 'currentFunding', 'status', 'apiId', 'id'],
	properties: {
		softGoal: {
			dataType: 'uint64',
			fieldNumber: 1,
		},
		hardGoal: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
		currentFunding: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
		deadline: {
			dataType: 'string',
			fieldNumber: 4,
		},
		apiId: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
		id: {
			dataType: 'bytes',
			fieldNumber: 6,
		},
	},
};

export const accountStoreSchema = {
	$id: 'campaign/account',
	type: 'object',
	required: ['campaigns'],
	properties: {
		campaigns: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
	},
};

export const createCommandParamsSchema = {
	$id: 'campaign/create',
	title: 'CreateAsset transaction asset for campaign module',
	type: 'object',
	required: ['softGoal', 'hardGoal', 'deadline', 'apiId'],
	properties: {
		softGoal: {
			dataType: 'string',
			fieldNumber: 1,
		},
		hardGoal: {
			dataType: 'string',
			fieldNumber: 2,
		},
		deadline: {
			dataType: 'string',
			fieldNumber: 3,
		},
		apiId: {
			dataType: 'number',
			fieldNumber: 4,
		},
	},
};

export const campaignCreatedEventDataSchema = {
	$id: '/campaign/events/campaignCreatedEventData',
	type: 'object',
	required: ['submitter', 'campaignID'],
	properties: {
		submitter: {
			dataType: 'bytes',
			format: 'lisk32',
			fieldNumber: 1,
		},
		campaignID: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};
