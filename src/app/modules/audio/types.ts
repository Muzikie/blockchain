export interface Audio {
	ownerAddress: Buffer;
	name: string;
	releaseYear: number;
	artistName: string;
	genre: number[];
}

export interface AudioAccount {
	audios: Buffer[];
}

export interface CreateCommandParams {
	name: string;
	releaseYear: number;
	artistName: string;
	genre: number[];
}
