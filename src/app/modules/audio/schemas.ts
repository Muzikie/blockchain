export const audioStoreSchema = {
  $id: 'audio/audio',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre'],
  fieldNumber: 1,
  properties: {
    name: {
      type: 'string',
      fieldNumber: 1,
    },
    releaseYear: {
      type: 'unit32',
      fieldNumber: 2,
    },
    artistName: {
      type: 'string',
      fieldNumber: 3,
    },
    genre: {
      type: 'array',
      fieldNumber: 4,
      items: {
        type: 'unit32',
      },
    },
    ownerAddress: {
      type: 'bytes',
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
  $id: 'audio/create-command',
  title: 'CreateAsset transaction asset for audio module',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre'],
  properties: {
    name: {
      type: 'string',
      fieldNumber: 1,
      minLength: 3,
      maxLength: 40,
    },
    releaseYear: {
      type: 'unit32',
      fieldNumber: 2,
    },
    artistName: {
      type: 'string',
      fieldNumber: 3,
      minLength: 3,
      maxLength: 40,
    },
    genre: {
      type: 'array',
      fieldNumber: 4,
      items: {
        type: 'unit32',
      },
    },
  },
};
