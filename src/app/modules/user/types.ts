export enum SocialAccountType {
  Instagram = 0,
  Twitter = 1,
  Youtube = 2,
}

interface SocialAccount {
  username: string;
  type: SocialAccountType;
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
export interface UserAccount {
  userID: Buffer;
}

