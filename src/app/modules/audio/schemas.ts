export const audioStoreSchema = {
  $id: 'audio/audio',
  type: 'object',
  required: [
    'name',
    'releaseYear',
    'genre',
    'collectionID',
    'owners',
    'audioSignature',
    'audioHash',
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
        $id: 'audio/audio/owners',
        type: 'object',
        required: ['address', 'shares'],
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
    audioSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    audioHash: {
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
    'genre',
    'collectionID',
    'owners',
    'audioSignature',
    'audioHash',
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
    audioSignature: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    audioHash: {
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
    shares: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
  },
};

export const setAttributesCommandParamsSchema = {
  $id: 'audio/setAttributes',
  title: 'SetAttributesAsset transaction asset for audio module',
  type: 'object',
  required: ['name', 'releaseYear', 'genre', 'feat', 'collectionID', 'audioID'],
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
    audioID: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
  },
};

export const streamCommandParamsSchema = {
  $id: 'audio/stream',
  title: 'StreamAsset transaction asset for audio module',
  type: 'object',
  required: ['audioID'],
  properties: {
    audioID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const reclaimCommandParamsSchema = {
  $id: 'audio/reclaim',
  title: 'ReclaimAsset transaction asset for audio module',
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const audioCreatedEventDataSchema = {
  $id: '/audio/events/audioCreatedData',
  type: 'object',
  required: ['creatorAddress', 'audioID'],
  properties: {
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    audioID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
  },
};

export const addressRequestSchema = {
  $id: '/audio/addressRequest',
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
  $id: '/audio/idRequest',
  type: 'object',
  properties: {
    audioID: {
      type: 'string',
      format: 'hex',
    },
  },
  required: ['audioID'],
};
