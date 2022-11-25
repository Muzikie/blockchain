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
