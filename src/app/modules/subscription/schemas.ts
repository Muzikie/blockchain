export const subscriptionStoreSchema =  {
  $id: 'subscription/subscription',
  type: 'object',
  required: ['price', 'consumable', 'streams', 'members', 'creatorAddress'],
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
    creatorAddress: {
      dataType: 'bytes',
      fieldNumber: 5,
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
          fieldNumber: 1,
          dataType: 'bytes',
        },
        shared: {
          fieldNumber: 2,
          dataType: 'bytes',
        }
      }
    },
  },
};
