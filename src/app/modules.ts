/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TokenMethod } from 'lisk-framework';
import { AnchorModule } from './modules/anchor/module';
import { BadgeModule } from './modules/badge/module';

export const registerModules = (app: Application, token: TokenMethod): void => {
  const badgeModule = new BadgeModule();
  const anchorModule = new AnchorModule();

  badgeModule.addDependencies(token);
  anchorModule.addDependencies(token, badgeModule.method);

  app.registerModule(badgeModule);
  app.registerModule(anchorModule);
};
