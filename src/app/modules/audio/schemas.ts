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
