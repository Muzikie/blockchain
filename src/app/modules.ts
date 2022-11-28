/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { AudioModule } from "./modules/audio/module";
import { CollectionModule } from "./modules/collection/module";

export const registerModules = (app: Application): void => {
  app.registerModule(new AudioModule());
  app.registerModule(new CollectionModule());
};
