export const campaignStoreSchema = {
	$id: 'campaign/campaign',
	type: 'object',
	required: [
		'softGoal',
		'hardGoal',
		'currentFunding',
		'deadline',
		'status',
		'apiId',
		'contributionTiers',
		'id',
	],
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
		status: {
			dataType: 'string',
			fieldNumber: 5,
		},
		apiId: {
			dataType: 'uint32',
			fieldNumber: 6,
		},
		contributionTiers: {
			type: 'array',
			fieldNumber: 7,
			items: {
				type: 'object',
				required: ['amount', 'apiId'],
				properties: {
					amount: {
						dataType: 'uint64',
						fieldNumber: 1,
					},
					apiId: {
						dataType: 'uint32',
						fieldNumber: 2,
					},
				},
			},
		},
		id: {
			dataType: 'bytes',
			fieldNumber: 8,
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
	title: 'Create transaction asset for campaign module',
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

export const addTierCommandParamsSchema = {
	$id: 'campaign/addTier',
	title: 'AddTier transaction asset for campaign module',
	type: 'object',
	required: ['amount', 'apiId', 'campaignId'],
	properties: {
		amount: {
			dataType: 'string',
			fieldNumber: 1,
		},
		apiId: {
			dataType: 'number',
			fieldNumber: 2,
		},
		campaignId: {
			dataType: 'string',
			fieldNumber: 3,
		},
	},
};

export const publishCommandParamsSchema = {
	$id: 'campaign/publish',
	title: 'Publish transaction asset for campaign module',
	type: 'object',
	required: ['campaignId'],
	properties: {
		campaignId: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const campaignCreatedEventDataSchema = {
	$id: '/campaign/events/campaignCreatedEventData',
	type: 'object',
	required: ['submitter', 'campaignId'],
	properties: {
		submitter: {
			dataType: 'bytes',
			format: 'lisk32',
			fieldNumber: 1,
		},
		campaignId: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};

export const contributionTierAddedEventDataSchema = {
	$id: '/campaign/events/contributionTierAddedEventData',
	type: 'object',
	required: ['submitter', 'campaignId'],
	properties: {
		submitter: {
			dataType: 'bytes',
			format: 'lisk32',
			fieldNumber: 1,
		},
		campaignId: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};

export const campaignPublishedEventDataSchema = {
	$id: '/campaign/events/campaignPublishedEventData',
	type: 'object',
	required: ['submitter', 'campaignId'],
	properties: {
		submitter: {
			dataType: 'bytes',
			format: 'lisk32',
			fieldNumber: 1,
		},
		campaignId: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};
