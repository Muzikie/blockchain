export const collectionStoreSchema = {
  $id: 'collection/collection',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'artistName',
    'coArtists',
    'collectionType',
    'audios',
    'ownerAddress',
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    audios: {
      type: 'array',
      fieldNumber: 6,
      items: {
        dataType: 'bytes',
      },
    },
    ownerAddress: {
      dataType: 'bytes',
      fieldNumber: 7,
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
  required: ['name', 'releaseYear', 'artistName', 'coArtists', 'collectionType'],
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
  },
};

export const destroyCommandParamsSchema = {
  $id: 'collection/destroy',
  title: 'DestroyAsset transaction asset for collection module',
  type: 'object',
  required: ['collectionID'],
  properties: {
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const transferCommandParamsSchema = {
  $id: 'collection/transfer',
  title: 'TransferAsset transaction asset for collection module',
  type: 'object',
  required: ['collectionID', 'address'],
  properties: {
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
    address: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 2,
    },
  },
};

export const setAttributesCommandParamsSchema = {
  $id: 'collection/setAttributes',
  title: 'SetAttributesAsset transaction asset for collection module',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'coArtists', 'collectionType', 'collectionID'],
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 5,
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

