import md5  from 'md5';
import { CreateCommandParams } from './types';

export const getAnchorID = (params: CreateCommandParams): Buffer => 
  Buffer.concat(([Buffer.from(md5(params.spotifyId), 'hex')]))
