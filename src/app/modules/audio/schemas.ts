export const audioStoreSchema = {
  $id: 'audio/audio',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre'],
  fieldNumber: 1,
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    releaseYear: {
      dataType: 'uint32',
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
    ownerAddress: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
  },
};

export const accountStoreSchema = {
  $id: 'audio/accounts',
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
};

export const createCommandParamsSchema = {
  $id: 'audio/CreateCommand',
  title: 'CreateAsset transaction asset for audio module',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
      minLength: 3,
      maxLength: 40,
    },
    releaseYear: {
      dataType: 'uint32',
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
  },
};
