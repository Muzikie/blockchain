export const anchorStoreSchema = {
  $id: 'anchor/anchor',
  type: 'object',
  required: ['price', 'consumable', 'streams', 'members', 'maxMembers', 'creatorAddress'],
  properties: {
    price: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    consumable: {
      dataType: 'uint64',
      fieldNumber: 2,
    },
    streams: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    members: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'bytes',
      },
    },
    maxMembers: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 6,
    },
  },
};

export const accountStoreSchema = {
  $id: 'anchor/account',
  type: 'object',
  required: ['anchor'],
  properties: {
    anchor: {
      type: 'object',
      required: ['owned', 'shared'],
      fieldNumber: 1,
      properties: {
        owned: {
          type: 'array',
          fieldNumber: 1,
          items: {
            dataType: 'bytes',
          },
        },
        shared: {
          fieldNumber: 2,
          dataType: 'bytes',
        },
      },
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'anchor/create',
  title: 'CreateAsset transaction asset for anchor module',
  type: 'object',
  required: ['maxMembers', 'price'],
  properties: {
    maxMembers: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    price: {
      dataType: 'uint64',
      fieldNumber: 2,
    },
  },
};

export const purchaseCommandParamsSchema = {
  $id: 'anchor/purchase',
  title: 'PurchaseAsset transaction asset for anchor module',
  type: 'object',
  required: ['anchorID', 'members'],
  properties: {
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    members: {
      type: 'array',
      fieldNumber: 2,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
    },
  },
};

export const updateMembersCommandParamsSchema = {
  $id: 'anchor/updateMembers',
  title: 'UpdateMembersAsset transaction asset for anchor module',
  type: 'object',
  required: ['anchorID', 'members'],
  properties: {
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    members: {
      type: 'array',
      fieldNumber: 2,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
    },
  },
};

export const addressRequestSchema = {
  $id: '/anchor/addressRequest',
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
  $id: '/anchor/idRequest',
  type: 'object',
  properties: {
    anchorID: {
      type: 'string',
      format: 'hex',
    },
  },
  required: ['anchorID'],
};

export const hasAnchorResponse = {
  $id: '/anchor/hasAnchorResponse',
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
    },
    message: {
      type: 'string',
    }
  },
  required: ['success', 'message'],
};

export const anchorCreatedEventDataSchema = {
  $id: '/anchor/events/anchorCreatedEventData',
  type: 'object',
  required: ['creatorAddress', 'anchorID'],
  properties: {
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    consumable: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    streams: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
  },
};
