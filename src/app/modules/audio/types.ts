export interface Audio {
	name: string;
	releaseYear: string;
	artistName: string;
	ownerAddress: Buffer;
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
