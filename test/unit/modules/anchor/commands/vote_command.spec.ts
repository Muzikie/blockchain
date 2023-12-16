import { VoteCommand } from '../../../../../src/app/modules/anchor/commands/vote_command';
import { AnchorModule } from '../../../../../src/app/modules/anchor/module';

describe('VoteCommand', () => {
	let command: VoteCommand;
	const module = new AnchorModule();

	beforeEach(() => {
		command = new VoteCommand(module.stores, module.events);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('vote');
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
