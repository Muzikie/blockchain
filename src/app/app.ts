import { Application, Types } from 'klayr-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (config: Types.PartialApplicationConfig): Application => {
	const { app, method } = Application.defaultApplication(config);

	registerModules(app, method.token);
	registerPlugins(app);

	return app;
};
