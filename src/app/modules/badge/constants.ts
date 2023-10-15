import { address as cryptoAddress } from '@liskhq/lisk-cryptography';

const lisk32DevAddress = 'lskh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke';
const lisk32Treasury = 'lskyg9ujmpkbn7ex96ejedhfrkj6avryn5nwgngbp';

export const DEV_ADDRESS = cryptoAddress.getAddressFromLisk32Address(lisk32DevAddress);
export const TREASURY_ADDRESS = cryptoAddress.getAddressFromLisk32Address(lisk32Treasury);


export const VALID_GENRES = [
  { id: 0, name: 'Pop' },
  { id: 1, name: 'Soul' },
  { id: 2, name: 'Rock' },
  { id: 3, name: 'Hip-Hop & Rap' },
  { id: 4, name: 'Country' },
  { id: 5, name: 'R&B' },
  { id: 6, name: 'Folk' },
  { id: 7, name: 'Jazz' },
  { id: 8, name: 'Heavy Metal' },
  { id: 9, name: 'EDM' },
  { id: 10, name: 'Psychedelic Rock' },
  { id: 11, name: 'Funk' },
  { id: 12, name: 'Reggae' },
  { id: 13, name: 'Disco' },
  { id: 14, name: 'Punk Rock' },
  { id: 15, name: 'Classical' },
  { id: 16, name: 'House' },
  { id: 17, name: 'Techno' },
  { id: 18, name: 'Indie Rock' },
  { id: 19, name: 'Grunge' },
  { id: 20, name: 'Ambient' },
  { id: 21, name: 'Gospel' },
  { id: 22, name: 'Latin Music' },
  { id: 23, name: 'Grime' },
  { id: 24, name: 'Trap' },
];
export const MIN_RELEASE_YEAR = 1900;
export const STREAM_COST = BigInt(28500000);
