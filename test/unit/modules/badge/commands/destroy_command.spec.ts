import { DestroyCommand } from '../../../../../src/app/modules/badge/commands/destroy_command';
import { BadgeModule } from '../../../../../src/app/modules/badge/module';

describe('DestroyCommand', () => {
	let command: DestroyCommand;
	const module = new BadgeModule();

	beforeEach(() => {
		command = new DestroyCommand(module.stores, module.events);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('destroy');
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
