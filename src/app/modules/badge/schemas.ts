export const badgeStoreSchema = {
  $id: 'badge/badge',
  type: 'object',
  required: [
    'badgeID',
    'anchorID',
    'awardedTo',
    'type',
    'awardDate',
    'rank',
    'prize',
    'claimed',
  ],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    awardedTo: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 3,
    },
    type: {
      dataType: 'string',
      fieldNumber: 4,
    },
    awardDate: {
      dataType: 'string',
      fieldNumber: 5,
    },
    rank: {
      dataType: 'uint32',
      fieldNumber: 6,
    },
    prize: {
      dataType: 'uint64',
      fieldNumber: 7,
    },
    claimed: {
      dataType: 'boolean',
      fieldNumber: 8,
    },
  },
};

export const accountStoreSchema = {
  $id: 'badge/account',
  type: 'object',
  required: ['badges'],
  properties: {
    badges: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'badge/create',
  title: 'CreateAsset transaction asset for badge module',
  type: 'object',
  required: [
    'anchorID',
    'awardedTo',
    'type',
    'awardDate',
    'rank',
  ],
  properties: {
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    awardedTo: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 2,
    },
    type: {
      dataType: 'string',
      fieldNumber: 3,
    },
    awardDate: {
      dataType: 'string',
      fieldNumber: 4,
    },
    rank: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
  },
};

export const destroyCommandParamsSchema = {
  $id: 'badge/destroy',
  title: 'DestroyAsset transaction asset for badge module',
  type: 'object',
  required: ['badgeID'],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const claimCommandParamsSchema = {
  $id: 'badge/reclaim',
  title: 'ClaimAsset transaction asset for badge module',
  type: 'object',
  required: ['badgeID'],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const badgeCreatedEventDataSchema = {
  $id: '/badge/events/badgeCreatedEventData',
  type: 'object',
  required: ['badgeID', 'prize'],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    prize: {
      dataType: 'uint64',
      fieldNumber: 2,
    },
  },
};

export const BadgeClaimedEventDataSchema = {
  $id: '/badge/events/badgeClaimedData',
  type: 'object',
  required: ['address', 'claimData'],
  properties: {
    address: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    claimData: {
      $id: 'badge/events/badgeClaimedData/claimData',
      type: 'object',
      fieldNumber: 2,
      required: ['badgeID', 'prize'],
      properties: {
        badgeID: {
          dataType: 'bytes',
          fieldNumber: 1,
        },
        prize: {
          dataType: 'uint64',
          fieldNumber: 2,
        },
      },
    },
  },
};

export const addressRequestSchema = {
  $id: '/badge/addressRequest',
  type: 'object',
  properties: {
    address: {
      type: 'string',
      format: 'lisk32',
    },
  },
  required: ['address'],
};

export const idRequestSchema = {
  $id: '/badge/idRequest',
  type: 'object',
  properties: {
    badgeID: {
      type: 'string',
      format: 'hex',
    },
  },
  required: ['badgeID'],
};
