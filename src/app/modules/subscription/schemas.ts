export const subscriptionStoreSchema =  {
  $id: 'subscription/subscription',
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
      members: {
        dataType: 'bytes',
      }
    },
    maxMembers: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    creatorAddress: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

export const accountStoreSchema = {
  $id: 'subscription/account',
  type: 'object',
  required: ['subscription'],
  properties: {
    subscription: {
      type: 'object',
      required: ['owned', 'shared'],
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
        }
      }
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'subscription/create',
  title: 'CreateAsset transaction asset for subscription module',
  type: 'object',
  required: [
    'maxMembers',
    'price',
  ],
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
  $id: 'subscription/purchase',
  title: 'PurchaseAsset transaction asset for subscription module',
  type: 'object',
  required: [
    'subscriptionID',
    'members',
  ],
  properties: {
    subscriptionID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    members: {
      type: 'array',
      fieldNumber: 2,
      items: {
        dataType: 'bytes',
      },
    },
  },
};
