/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Modules } from 'klayr-framework';
import { CampaignModule } from './modules/campaign/module';

export const registerModules = (app: Application, token: Modules.Token.TokenMethod): void => {
	const campaignModule = new CampaignModule();
	campaignModule.addDependencies(token);
	app.registerModule(campaignModule);
};
