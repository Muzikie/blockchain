import { AddTierCommand } from '../../../../../src/app/modules/campaign/commands/add_tier_command';
import { CampaignModule } from '../../../../../src/app/modules/campaign/module';

describe('AddTierCommand', () => {
	let command: AddTierCommand;
	const module = new CampaignModule();

	beforeEach(() => {
		command = new AddTierCommand(module.stores, module.events);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('addTier');
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
