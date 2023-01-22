/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TokenMethod } from 'lisk-framework';
import { AudioModule } from './modules/audio/module';
import { CollectionModule } from './modules/collection/module';
import { SubscriptionModule } from './modules/subscription/module';
import { ProfileModule } from "./modules/profile/module";

export const registerModules = (app: Application, token: TokenMethod): void => {
  const audioModule = new AudioModule();
  const collectionModule = new CollectionModule();
  const subscriptionModule = new SubscriptionModule();
  const profileModule = new ProfileModule();

  audioModule.addDependencies(
    collectionModule.method,
    subscriptionModule.method,
    token,
  );
  subscriptionModule.addDependencies(token);

  app.registerModule(audioModule);
  app.registerModule(collectionModule);
  app.registerModule(subscriptionModule);
  app.registerModule(profileModule);
};
