import { Application, Types } from 'klayr-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (config: Types.PartialApplicationConfig): Application => {
	const { app } = Application.defaultApplication(config);

	registerModules(app);
	registerPlugins(app);

	return app;
};
