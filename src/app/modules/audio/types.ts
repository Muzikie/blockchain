export interface Audio {
	name: string;
	releaseYear: number;
	artistName: string;
	genre: number[];
}

export interface AudioAccount {
	audios: Buffer[];
}
