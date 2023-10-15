export const anchorStoreSchema = {
  $id: 'anchor/anchor',
  type: 'object',
  required: ['spotifyId', 'appleMusicId', 'name', 'album', 'artists', 'images', 'createdAt', 'submitter', 'id'],
  properties: {
    spotifyId: {
      dataType: 'string',
      fieldNumber: 1,
    },
    appleMusicId: {
      dataType: 'string',
      fieldNumber: 2,
    },
    name: {
      dataType: 'string',
      fieldNumber: 3,
    },
    album: {
      dataType: 'string',
      fieldNumber: 4,
    },
    artists: {
      type: 'array',
      fieldNumber: 5,
      items: {
        dataType: 'string',
      },
    },
    images: {
      type: 'array',
      fieldNumber: 6,
      items: {
        dataType: 'object',
        required: ['url', 'height', 'width'],
        url: {
          dataType: 'string',
          fieldNumber: 1,
        },
        height: {
          dataType: 'uint32',
          fieldNumber: 2,
        },
        width: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
      },
    },
    submitter: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 7,
    },
    createdAt: {
      dataType: 'string',
      fieldNumber: 8,
    },
    votes: {
      type: 'array',
      fieldNumber: 9,
      items: {
        dataType: 'bytes',
        format: 'lisk32',
      },
    },
    id: {
      dataType: 'bytes',
      fieldNumber: 10,
    },
  },
};

export const accountStoreSchema = {
  $id: 'anchor/account',
  type: 'object',
  required: ['anchors', 'votes'],
  properties: {
    anchors: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
    votes: {
      type: 'array',
      fieldNumber: 2,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

export const createCommandParamsSchema = {
  $id: 'anchor/create',
  title: 'CreateAsset transaction asset for anchor module',
  type: 'object',
  required: ['spotifyId', 'appleMusicId', 'name', 'album', 'artists', 'images'],
  properties: {
    spotifyId: {
      dataType: 'string',
      fieldNumber: 1,
    },
    appleMusicId: {
      dataType: 'string',
      fieldNumber: 2,
    },
    name: {
      dataType: 'string',
      fieldNumber: 3,
    },
    album: {
      dataType: 'string',
      fieldNumber: 4,
    },
    artists: {
      type: 'array',
      fieldNumber: 5,
      items: {
        dataType: 'string',
      },
    },
    images: {
      type: 'array',
      fieldNumber: 6,
      items: {
        dataType: 'object',
        required: ['url', 'height', 'width'],
        url: {
          dataType: 'string',
          fieldNumber: 1,
        },
        height: {
          dataType: 'uint32',
          fieldNumber: 2,
        },
        width: {
          dataType: 'uint32',
          fieldNumber: 3,
        },
      },
    },
  },
};

export const voteCommandParamsSchema = {
  $id: 'anchor/vote',
  title: 'VoteAsset transaction asset for anchor module',
  type: 'object',
  required: ['anchorID'],
  properties: {
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 1,
    },
  },
};

export const addressRequestSchema = {
  $id: '/anchor/addressRequest',
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
  $id: '/anchor/idRequest',
  type: 'object',
  properties: {
    anchorID: {
      type: 'string',
      format: 'hex',
    },
  },
  required: ['anchorID'],
};

export const hasAnchorResponse = {
  $id: '/anchor/hasAnchorResponse',
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
    },
    message: {
      type: 'string',
    }
  },
  required: ['success', 'message'],
};

export const anchorCreatedEventDataSchema = {
  $id: '/anchor/events/anchorCreatedEventData',
  type: 'object',
  required: ['creatorAddress', 'anchorID'],
  properties: {
    creatorAddress: {
      dataType: 'bytes',
      format: 'lisk32',
      fieldNumber: 1,
    },
    anchorID: {
      dataType: 'bytes',
      fieldNumber: 2,
    },
    consumable: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    streams: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
  },
};
