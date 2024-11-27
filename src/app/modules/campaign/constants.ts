import { address as cryptoAddress } from '@klayr/cryptography';

export const DEV_SHARE = BigInt(15) / BigInt(100);
export const TRANSFER_FEE = BigInt(200000);

const devAddress32 = 'klyh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke';
const treasuryAddress32 = 'klyyg9ujmpkbn7ex96ejedhfrkj6avryn5nwgngbp';

export const DEV_ADDRESS = cryptoAddress.getAddressFromKlayr32Address(devAddress32);
export const TREASURY_ADDRESS = cryptoAddress.getAddressFromKlayr32Address(treasuryAddress32);
