import { BaseGenesisBlockCommand } from 'klayr-commander';
import { Application, Types } from 'klayr-sdk';
import { join } from 'path';
import { getApplication } from '../../app/app';

export class GenesisBlockCommand extends BaseGenesisBlockCommand {
	public getApplication(config: Types.PartialApplicationConfig): Application {
		const app = getApplication(config);
		return app;
	}

	public getApplicationConfigDir(): string {
		return join(__dirname, '../../../config');
	}
}
