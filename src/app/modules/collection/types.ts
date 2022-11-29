export interface Collection {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
  type: number;
  ownerAddress: Buffer;
}

export interface CollectionJSON {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
  type: number;
  ownerAddress: string;
}

export interface CollectionAccount {
  collection: {
    collections: Buffer[];
  };
}

export interface CollectionAccountJSON {
  collection: {
    collections: string[];
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

export interface TransferCommandParams {
  collectionID: Buffer;
  address: Buffer;
}

export interface SetAttributesCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  coArtists: string[];
  type: number;
  collectionID: Buffer;
}
