export const audioStoreSchema = {
  $id: 'audio/audio',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'artistName',
    'genre',
    'collectionID',
    'owners',
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
    artistName: {
      dataType: 'string',
      fieldNumber: 3,
    },
    genre: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'uint32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    owners: {
      type: 'array',
      fieldNumber: 6,
      items: {
        $id: 'audio/audio/owners',
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
    creatorAddress: {
      dataType: 'bytes',
      fieldNumber: 7,
    },
  },
};

export const accountStoreSchema = {
  $id: 'audio/account',
  type: 'object',
  required: ['audio'],
  properties: {
    audio: {
      type: 'object',
      required: ['audios'],
      fieldNumber: 1,
      properties: {
        audios: {
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
  $id: 'audio/create',
  title: 'CreateAsset transaction asset for audio module',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'artistName',
    'genre',
    'collectionID',
    'owners',
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
    artistName: {
      dataType: 'string',
      fieldNumber: 3,
      minLength: 3,
      maxLength: 40,
    },
    genre: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'uint32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    owners: {
      type: 'array',
      fieldNumber: 6,
      items: {
        $id: 'audio/create/owners',
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
  },
};

export const destroyCommandParamsSchema = {
  $id: 'audio/destroy',
  title: 'DestroyAsset transaction asset for audio module',
  type: 'object',
  required: ['audioID'],
  properties: {
    audioID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const transferCommandParamsSchema = {
  $id: 'audio/transfer',
  title: 'TransferAsset transaction asset for audio module',
  type: 'object',
  required: ['audioID', 'address'],
  properties: {
    audioID: {
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
  $id: 'audio/setAttributes',
  title: 'SetAttributesAsset transaction asset for audio module',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre', 'collectionID', 'audioID'],
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
    genre: {
      type: 'array',
      fieldNumber: 4,
      items: {
        dataType: 'uint32',
      },
    },
    collectionID: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    audioID: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

export const creationEventSchema = {
  $id: '/audio/events/creation',
  type: 'object',
  required: ['senderAddress', 'audioID'],
  properties: {
    senderAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    audioID: {
      dataType: 'bytes',
      fieldNumber: 3,
    },
  },
};
