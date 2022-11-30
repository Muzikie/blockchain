import { CreateCommandParams } from './types';

export const getNodeForName =  (params: CreateCommandParams): Buffer =>
  Buffer.from(`${params.name}${params.artistName}`, 'utf8');
