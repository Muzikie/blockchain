export const userStoreSchema = {
  $id: 'user/user',
  type: 'object',
  required: [
    'name',
    'nickName',
    'description',
    'socialAccounts',
    'avatarHash',
    'avatarSignature',
    'bannerHash',
    'bannerSignature',
    'creatorAddress',
  ],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    nickName: {
      dataType: 'string',
      fieldNumber: 2,
    },
    description: {
      dataType: 'string',
      fieldNumber: 3,
    },
    socialAccounts: {
      type: 'array',
      fieldNumber: 4,
      items: {
        $id: 'user/user/socialAccounts',
        type: 'object',
        required: ['username', 'type'],
        properties: {
          username: {
            dataType: 'string',
            fieldNumber: 1,
          },
          type: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
        },
      },
    },
    avatarHash: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    avatarSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    bannerHash: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
    bannerSignature: {
      dataType: 'bytes',
      fieldNumber: 8,
    },
    creatorAddress: {
      dataType: 'bytes',
      fieldNumber: 9,
    },
  },
};

export const accountStoreSchema = {
  $id: 'user/account',
  type: 'object',
  required: ['userID'],
  properties: {
    userID: {
      type: 'buffer',
      fieldNumber: 1,
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'user/create',
  title: 'CreateAsset transaction asset for user module',
  type: 'object',
  required: [
    'name',
    'nickName',
    'description',
    'socialAccounts',
    'avatarHash',
    'avatarSignature',
    'bannerHash',
    'bannerSignature',
  ],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    nickName: {
      dataType: 'string',
      fieldNumber: 2,
    },
    description: {
      dataType: 'string',
      fieldNumber: 3,
    },
    socialAccounts: {
      type: 'array',
      fieldNumber: 4,
      items: {
        $id: 'user/user/socialAccounts',
        type: 'object',
        required: ['username', 'type'],
        properties: {
          username: {
            dataType: 'string',
            fieldNumber: 1,
          },
          type: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
        },
      },
    },
    avatarHash: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    avatarSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    bannerHash: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
    bannerSignature: {
      dataType: 'bytes',
      fieldNumber: 8,
    },
  },
};
