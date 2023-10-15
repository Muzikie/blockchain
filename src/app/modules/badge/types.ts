// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export interface LoyaltyOwner {
  address: Buffer;
  shares: number;
  income: bigint;
}

export interface LoyaltyOwnerJSON {
  address: string;
  shares: number;
  income: string;
}

export interface Badge {
  name: string;
  releaseYear: string;
  genre: number[];
  collectionID: Buffer;
  creatorAddress: Buffer;
  owners: LoyaltyOwner[];
  badgeSignature: Buffer;
  badgeHash: Buffer;
  feat: Buffer[];
}

export interface BadgeJSON {
  creatorAddress: string;
  name: string;
  releaseYear: number;
  genre: number[];
  collectionID: string;
  owners: LoyaltyOwnerJSON[];
  badgeSignature: string;
  badgeHash: string;
  feat: string[];
}

export interface BadgeAccount {
  badge: {
    badges: Buffer[];
  };
}

export interface BadgeAccountJSON {
  badge: {
    badges: string[];
  };
}

export interface CreateCommandParams {
  name: string;
  releaseYear: string;
  genre: number[];
  collectionID: Buffer;
  owners: Omit<LoyaltyOwner, 'income'>[];
  badgeSignature: Buffer;
  badgeHash: Buffer;
  feat: Buffer[];
}

export interface DestroyCommandParams {
  badgeID: Buffer;
}

export interface TransferCommandParams {
  badgeID: Buffer;
  address: Buffer;
  shares: number;
}

// @todo do we need the collectionID? Do we intend to change it?
export interface SetAttributesCommandParams {
  name: string;
  releaseYear: string;
  genre: number[];
  collectionID: Buffer;
  badgeID: Buffer;
  feat: Buffer[];
}

export interface StreamCommandParams {
  badgeID: Buffer;
}

export interface ReclaimCommandParams {
  id: Buffer;
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
  creatorAddress: Buffer;
  badgeID: Buffer;
}

export interface BadgeStreamedEventData {
  address: Buffer;
  owners: LoyaltyOwner[];
}

export interface ClaimData {
  badgeIDs: Buffer[];
  totalClaimed: bigint;
};

export interface BadgeIncomeReclaimedEventData {
  address: Buffer;
  claimData: ClaimData;
}

export interface BadgeSetAttributeEventData {
  creatorAddress: Buffer;
  badgeID: Buffer;
}

export interface Genre {
  name: string;
  id: number;
}

export interface Success {
  success: boolean;
}
