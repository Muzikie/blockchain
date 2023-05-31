export const collectionStoreSchema = {
  $id: 'collection/collection',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'collectionType',
    'audios',
    'coverSignature',
    'coverHash',
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    audios: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'bytes',
      },
    },
    coverSignature: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    coverHash: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    creatorAddress: {
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
  required: ['name', 'releaseYear', 'collectionType', 'coverSignature', 'coverHash'],
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    coverSignature: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
    coverHash: {
      dataType: 'bytes',
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
  required: ['name', 'releaseYear', 'collectionType', 'collectionID'],
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
    collectionType: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 4,
    },
  },
};

export const addressRequestSchema = {
  $id: '/collection/addressRequest',
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
  $id: '/collection/idRequest',
  type: 'object',
  properties: {
    collectionID: {
      type: 'string',
      format: 'hex',
    },
  },
  required: ['collectionID'],
};

export const collectionCreatedEventDataSchema = {
  $id: '/collection/events/collectionCreatedEventData',
  type: 'object',
  required: ['creatorAddress', 'collectionID'],
  properties: {
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
  },
};
