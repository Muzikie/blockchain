import { CreateCommandParams } from './types';

export const getNodeForName =  (params: Pick<CreateCommandParams, 'name' | 'artistName'>): Buffer =>
  Buffer.from(`${params.name}${params.artistName}`, 'utf8');
