/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { AudioModule } from "./modules/audio/module";

export const registerModules = (app: Application): void => {
  app.registerModule(new AudioModule());
};
