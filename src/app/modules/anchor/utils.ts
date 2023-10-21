import { CreateCommandParams } from './types';

export const getAnchorID = (params: CreateCommandParams): Buffer =>
  Buffer.concat([Buffer.from(params.spotifyId, 'utf8')]);

export const getCreatedAt = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toISOString().substring(0, 10);
};
