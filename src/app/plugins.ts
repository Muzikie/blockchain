/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { ChainConnectorPlugin } from '@klayr/chain-connector-plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(new ChainConnectorPlugin());
};
