/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { CampaignModule } from './modules/campaign/module';

export const registerModules = (app: Application): void => {
	app.registerModule(new CampaignModule());
};
