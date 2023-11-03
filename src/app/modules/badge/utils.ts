import md5 from 'md5';
import { Badges } from './types';

export const getBadgeID = (date: string, rank: number, type: Badges): Buffer => 
  Buffer.from(md5(`${date.replace('-', '_')}_${rank}_${type}`), 'hex')
