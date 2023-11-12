// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface Anchor {
  spotifyId?: string;
  appleMusicId?: string;
  name: string;
  album: string;
  artists: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
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
  artists: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  submitter: string;
  createdAt: string;
  id: string;
}

export interface AnchorAccount {
  anchors: Buffer[];
  votes: Buffer[];
}

export interface AnchorStats {
  date: string;
  anchorsCount: number;
  votesCount: number;
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
  artists: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
}

export interface VoteCommandParams {
  anchorID: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export enum CreateEventResult {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export interface AnchorCreatedEventData {
  submitter: Buffer;
  anchorID: Buffer;
  createdAt: string;
  badgeIDs: Buffer[];
}

export interface EventWinnerData {
  anchorID: Buffer;
  awardedTo: string;
  prize: bigint;
};

export type AnchorVotedEventData = {
  updatedWinners: EventWinnerData[];
};

