// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export enum Badges {
  AOTD = 'anchor_of_the_day',
  AOTW = 'anchor_of_the_week',
  AOTM = 'anchor_of_the_month',
}

export interface Badge {
  badgeID: Buffer;
  anchorID: Buffer;
  awardedTo: Buffer;
  type: Badges;
  awardDate: string;
  rank: number;
  prize: bigint;
  claimed: boolean;
}

export interface BadgeJSON {
  badgeID: string;
  anchorID: string;
  awardedTo: string;
  type: Badges;
  awardDate: string;
  rank: number;
  prize: string;
  claimed: boolean;
}

export interface BadgeAccount {
  badges: Buffer[];
}

export interface BadgeAccountJSON {
  badge: string[];
}

export interface CreateCommandParams {
  anchorID: Buffer;
  awardedTo: Buffer;
  type: Badges;
  awardDate: string;
  rank: number;
  prize: bigint;
}

export interface DestroyCommandParams {
  badgeID: Buffer;
}

export interface TransferCommandParams {
  badgeID: Buffer;
  address: Buffer;
  shares: number;
}

export interface ClaimCommandParams {
  badgeID: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

export enum CreateEventResult {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export interface BadgeCreatedEventData {
  badgeID: Buffer;
  prize: bigint;
}

export interface Success {
  success: boolean;
}

export interface UpdatedWinningAnchor {
  awardedTo: Buffer;
  anchorID: Buffer;
}
