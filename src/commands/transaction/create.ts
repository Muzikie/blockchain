/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { TransactionCreateCommand } from 'klayr-commander';
import { Application, Types } from 'klayr-sdk';
import { getApplication } from '../../app/app';

type CreateFlags = typeof TransactionCreateCommand.flags & {
	[key: string]: Record<string, unknown>;
};

export class CreateCommand extends TransactionCreateCommand {
	static flags: CreateFlags = {
		...TransactionCreateCommand.flags,
	};

	static args = [...TransactionCreateCommand.args];

	public getApplication(config: Types.PartialApplicationConfig): Application {
		const app = getApplication(config);
		return app;
	}
}
