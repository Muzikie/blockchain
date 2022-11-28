export interface Collection {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
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
}
