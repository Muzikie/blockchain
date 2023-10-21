import { Badges } from './types';

export const getBadgeID = (date: string, rank: number, type: Badges): Buffer =>
  Buffer.from(`${date.replace('-', '_')}_${rank}_${type}`, 'utf8');
