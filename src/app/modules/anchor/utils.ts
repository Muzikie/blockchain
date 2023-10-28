import { CreateCommandParams } from './types';

export const getAnchorID = (params: CreateCommandParams): Buffer =>
  Buffer.concat([Buffer.from(params.spotifyId, 'utf8')]);
