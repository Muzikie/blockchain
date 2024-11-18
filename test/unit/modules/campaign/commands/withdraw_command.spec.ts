import { PayoutCommand } from '../../../../../src/app/modules/campaign/commands/payout_command';
import { CampaignModule } from '../../../../../src/app/modules/campaign/module';

describe('PayoutCommand', () => {
	let command: PayoutCommand;
	const module = new CampaignModule();

	beforeEach(() => {
		command = new PayoutCommand(module.stores, module.events);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('payout');
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
