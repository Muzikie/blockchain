export const badgeStoreSchema = {
  $id: 'badge/badge',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'genre',
    'collectionID',
    'owners',
    'badgeSignature',
    'badgeHash',
    'feat',
    'creatorAddress',
  ],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    releaseYear: {
      dataType: 'string',
      fieldNumber: 2,
    },
    genre: {
      type: 'array',
      fieldNumber: 3,
      items: {
        dataType: 'uint32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    owners: {
      type: 'array',
      fieldNumber: 5,
      items: {
        $id: 'badge/badge/owners',
        type: 'object',
        required: ['address', 'shares', 'income'],
        properties: {
          address: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          shares: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
          income: {
            dataType: 'uint64',
            fieldNumber: 3,
          },
        },
      },
    },
    badgeSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    badgeHash: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
    feat: {
      type: 'array',
      fieldNumber: 8,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
    },
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 9,
    },
  },
};

export const accountStoreSchema = {
  $id: 'badge/account',
  type: 'object',
  required: ['badge'],
  properties: {
    badge: {
      type: 'object',
      required: ['badges'],
      fieldNumber: 1,
      properties: {
        badges: {
          type: 'array',
          fieldNumber: 1,
          items: {
            dataType: 'bytes',
          },
        },
      },
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'badge/create',
  title: 'CreateAsset transaction asset for badge module',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'genre',
    'collectionID',
    'owners',
    'badgeSignature',
    'badgeHash',
    'feat',
  ],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
      minLength: 3,
      maxLength: 40,
    },
    releaseYear: {
      dataType: 'string',
      fieldNumber: 2,
    },
    genre: {
      type: 'array',
      fieldNumber: 3,
      items: {
        dataType: 'uint32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    owners: {
      type: 'array',
      fieldNumber: 5,
      items: {
        $id: 'badge/create/owners',
        type: 'object',
        required: ['address', 'shares'],
        properties: {
          address: {
            dataType: 'bytes',
            format: 'lisk32',
            fieldNumber: 1,
          },
          shares: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
        },
      },
    },
    badgeSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    badgeHash: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
    feat: {
      type: 'array',
      fieldNumber: 8,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
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

export const transferCommandParamsSchema = {
  $id: 'badge/transfer',
  title: 'TransferAsset transaction asset for badge module',
  type: 'object',
  required: ['badgeID', 'address', 'shares'],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    address: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 2,
    },
    shares: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
  },
};

export const setAttributesCommandParamsSchema = {
  $id: 'badge/setAttributes',
  title: 'SetAttributesAsset transaction asset for badge module',
  type: 'object',
  required: ['name', 'releaseYear', 'genre', 'feat', 'collectionID', 'badgeID'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
      minLength: 3,
      maxLength: 40,
    },
    releaseYear: {
      dataType: 'string',
      fieldNumber: 2,
    },
    genre: {
      type: 'array',
      fieldNumber: 3,
      items: {
        dataType: 'uint32',
      },
    },
    feat: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

export const streamCommandParamsSchema = {
  $id: 'badge/stream',
  title: 'StreamAsset transaction asset for badge module',
  type: 'object',
  required: ['badgeID'],
  properties: {
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const reclaimCommandParamsSchema = {
  $id: 'badge/reclaim',
  title: 'ReclaimAsset transaction asset for badge module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const badgeCreatedEventDataSchema = {
  $id: '/badge/events/badgeCreatedData',
  type: 'object',
  required: ['creatorAddress', 'badgeID'],
  properties: {
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    badgeID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
  },
};

export const badgeStreamedEventDataSchema = {
  $id: '/badge/events/badgeStreamedData',
  type: 'object',
  required: ['address', 'owners'],
  properties: {
    address: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    owners: {
      type: 'array',
      fieldNumber: 2,
      items: {
        $id: 'badge/events/badgeStreamedData/owners',
        type: 'object',
        required: ['address', 'income', 'shares'],
        properties: {
          address: {
            dataType: 'bytes',
            format: 'lisk32',
            fieldNumber: 1,
          },
          income: {
            dataType: 'uint64',
            fieldNumber: 2,
          },
          shares: {
            dataType: 'uint32',
            fieldNumber: 3,
          },
        },
      },
    },
  },
};

export const BadgeIncomeReclaimedEventDataSchema = {
  $id: '/badge/events/badgeIncomeReclaimedData',
  type: 'object',
  required: ['address', 'claimData'],
  properties: {
    address: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    claimData: {
      $id: 'badge/events/badgeIncomeReclaimedData/claimData',
      type: 'object',
      fieldNumber: 2,
      required: ['badgeIDs', 'totalClaimed'],
      properties: {
        badgeIDs: {
          type: 'array',
          fieldNumber: 1,
          items: {
            dataType: 'bytes',
          }
        },
        totalClaimed: {
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
