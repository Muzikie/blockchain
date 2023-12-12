/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/member-ordering */
import { TransactionCreateCommand } from 'lisk-commander';
import { Application, PartialApplicationConfig } from 'lisk-sdk';
import { getApplication } from '../../app/app';

type CreateFlags = typeof TransactionCreateCommand.flags & {
	[key: string]: Record<string, unknown>;
};

export class CreateCommand extends TransactionCreateCommand {
	static flags: CreateFlags = {
		...TransactionCreateCommand.flags,
	};

	static args = [...TransactionCreateCommand.args];

	public getApplication(config: PartialApplicationConfig): Application {
		const app = getApplication(config);
		return app;
	}
}
