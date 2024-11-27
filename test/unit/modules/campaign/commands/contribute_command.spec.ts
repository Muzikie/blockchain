import { ContributeCommand } from '../../../../../src/app/modules/campaign/commands/contribute_command';
import { CampaignModule } from '../../../../../src/app/modules/campaign/module';

describe('ContributeCommand', () => {
	let command: ContributeCommand;
	const module = new CampaignModule();

	beforeEach(() => {
		command = new ContributeCommand(module.stores, module.events);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('contribute');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			it.todo('should throw errors for invalid schema');
			it.todo('should be ok for valid schema');
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it.todo('should update the state store');
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
