export interface Audio {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  ownerAddress: Buffer;
}

export interface AudioJSON {
  ownerAddress: string;
  name: string;
  releaseYear: number;
  artistName: string;
  genre: number[];
}

export interface AudioAccount {
  audio: {
    audios: Buffer[];
  };
}

export interface AudioAccountJSON {
  audio: {
    audios: string[];
  };
}

export interface CreateCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
}

export interface DestroyCommandParams {
  audioID: Buffer;
}

export interface TransferCommandParams {
  audioID: Buffer;
  address: Buffer;
}

export interface SetAttributeCommandParams {
  name: string;
  releaseYear: string;
  artistName: string;
  genre: number[];
  audioID: Buffer;
}
