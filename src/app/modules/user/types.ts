// eslint-disable-next-line import/no-extraneous-dependencies
import { ModuleEndpointContext } from 'lisk-framework';

export enum SocialAccountPlatform {
  Instagram = 0,
  Twitter = 1,
  Youtube = 2,
}

interface SocialAccount {
  username: string;
  platform: SocialAccountPlatform;
}

export interface User {
  name: string;
  nickName: string;
  description: string;
  socialAccounts: SocialAccount[];
  avatarHash: Buffer;
  avatarSignature: Buffer;
  bannerHash: Buffer;
  bannerSignature: Buffer;
  creatorAddress: Buffer;
}

export interface UserJSON {
  name: string;
  nickName: string;
  description: string;
  socialAccounts: SocialAccount[];
  avatarHash: string;
  avatarSignature: string;
  bannerHash: string;
  bannerSignature: string;
  creatorAddress: string;
}

export interface UserAccount {
  userID: Buffer;
}

export interface UserAccountJSON {
  userID: string;
}

export interface CreateCommandParams {
  name: string;
  nickName: string;
  description: string;
  socialAccounts: SocialAccount[];
  avatarHash: Buffer;
  avatarSignature: Buffer;
  bannerHash: Buffer;
  bannerSignature: Buffer;
}

export interface Store<Entity> {
  get: (context: ModuleEndpointContext, key: Buffer) => Promise<Entity>;
  has: (context: ModuleEndpointContext, key: Buffer) => Promise<boolean>;
}

