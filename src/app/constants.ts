import { address as cryptoAddress } from '@liskhq/lisk-cryptography';

export const COMMANDS = {
  CREATE: 'create',
  TRANSFER: 'transfer',
  SET_ATTRIBUTES: 'setAttributes',
  DESTROY: 'destroy',
};

export const MODULES = {
  BADGE: 'badge',
  ANCHOR: 'anchor',
};

const lisk32DevAddress = 'lskh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke';
const lisk32Treasury = 'lskyg9ujmpkbn7ex96ejedhfrkj6avryn5nwgngbp';

export const DEV_ADDRESS = cryptoAddress.getAddressFromLisk32Address(lisk32DevAddress);
export const TREASURY_ADDRESS = cryptoAddress.getAddressFromLisk32Address(lisk32Treasury);

