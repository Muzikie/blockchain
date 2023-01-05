/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TokenModule } from 'lisk-framework';
import { AudioModule } from "./modules/audio/module";
import { CollectionModule } from "./modules/collection/module";
import { SubscriptionModule } from "./modules/subscription/module";

export const registerModules = (app: Application): void => {
  const audioModule = new AudioModule();
  const collectionModule = new CollectionModule();
  const subscriptionModule = new SubscriptionModule();
  const tokenModule = new TokenModule();

  audioModule.addDependencies(
    collectionModule.method,
    subscriptionModule.method,
    tokenModule.method,
  );
  subscriptionModule.addDependencies(tokenModule.method);

  app.registerModule(audioModule);
  app.registerModule(collectionModule);
  app.registerModule(subscriptionModule);
};
