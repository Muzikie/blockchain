export const collectionStoreSchema = {
  $id: 'collection/collection',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'coArtists', 'ownerAddress'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    releaseYear: {
      dataType: 'string',
      fieldNumber: 2,
    },
    artistName: {
      dataType: 'string',
      fieldNumber: 3,
    },
    coArtists: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'string',
      },
    },
    type: {
      dataType: 'number',
      fieldNumber: 5,
    },
    ownerAddress: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

export const accountStoreSchema = {
  $id: 'collection/account',
  type: 'object',
  required: ['collection'],
  properties: {
    collection: {
      type: 'object',
      required: ['collections'],
      fieldNumber: 1,
      properties: {
        collections: {
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
  $id: 'collection/create',
  title: 'CreateAsset transaction asset for collection module',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'coArtists'],
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
    artistName: {
      dataType: 'string',
      fieldNumber: 3,
      minLength: 3,
      maxLength: 40,
    },
    coArtists: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'string',
      },
    },
    type: {
      dataType: 'number',
      fieldNumber: 5,
    },
  },
};
