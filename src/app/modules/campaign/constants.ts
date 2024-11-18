import { address as cryptoAddress } from '@klayr/cryptography';

export const CONTRIBUTION_FEE = BigInt(10000000);

const devAddress32 = 'lskh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke';
const treasuryAddress32 = 'lskyg9ujmpkbn7ex96ejedhfrkj6avryn5nwgngbp';

export const DEV_ADDRESS = cryptoAddress.getAddressFromKlayr32Address(devAddress32);
export const TREASURY_ADDRESS = cryptoAddress.getAddressFromKlayr32Address(treasuryAddress32);
