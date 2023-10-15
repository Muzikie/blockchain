// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface Anchor {
  spotifyId?: string;
  appleMusicId?: string;
  name: string;
  album: string;
  artists: string[];
  submitter: Buffer;
  createdAt: string;
  votes: Buffer[];
  id: Buffer;
}

export interface AnchorJSON {
  spotifyId?: string;
  appleMusicId?: string;
  name: string;
  album: string;
  artists: string[];
  submitter: string;
  createdAt: string;
  id: string;
}

export interface AnchorAccount {
  anchors: Buffer[];
  votes: Buffer[];
}

export interface AnchorAccountJSON {
  anchor: string[];
  votes: string[];
}

export interface CreateCommandParams {
  spotifyId: string;
  appleMusicId?: string;
  name: string;
  album: string;
  artists: string[];
}

export interface VoteCommandParams {
  anchorID: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export interface hasAnchorResponse {
  success: boolean;
  message?: string;
}

export enum CreateEventResult {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export interface AnchorCreatedEventData {
  submitter: Buffer;
  anchorID: Buffer;
  createdAt: string;
}
