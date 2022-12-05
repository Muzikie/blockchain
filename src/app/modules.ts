/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { AudioModule } from "./modules/audio/module";
import { CollectionModule } from "./modules/collection/module";
import { SubscriptionModule } from "./modules/subscription/module";

export const registerModules = (app: Application): void => {
  const audioModule = new AudioModule();
  const collectionModule = new CollectionModule();

  audioModule.addDependencies(collectionModule.method);

  app.registerModule(audioModule);
  app.registerModule(collectionModule);
  app.registerModule(new SubscriptionModule());
};
