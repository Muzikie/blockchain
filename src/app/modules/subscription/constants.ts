import { address as cryptoAddress } from '@liskhq/lisk-cryptography';

const lisk32DevAddress = 'lskh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke';
export const DEV_ADDRESS = cryptoAddress.getAddressFromLisk32Address(lisk32DevAddress);
