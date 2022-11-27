export const audioStoreSchema = {
  $id: 'audio/audio',
  type: 'object',
  required: ['name', 'releaseYear', 'artistName', 'genre', 'ownerAddress'],
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
    ownerAddress: {
      dataType: 'bytes',
      fieldNumber: 5,
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
  },
};

export const destroyCommandParamsSchema = {
  $id: 'audio/DestroyCommand',
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
