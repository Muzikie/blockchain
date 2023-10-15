import { Application, PartialApplicationConfig } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (config: PartialApplicationConfig): Application => {
  const { app, method } = Application.defaultApplication(config); // @todo do we need to pass true as a second argument?

  registerModules(app, method.token);
  registerPlugins(app);

  return app;
};
