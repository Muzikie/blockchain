export interface Collection {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
  type: number;
  ownerAddress: Buffer;
}

export interface CollectionAccount {
  collection: {
    collections: Buffer[];
  };
}

export interface CreateCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
  type: number;
}

export interface DestroyCommandParams {
  collectionID: Buffer;
}
