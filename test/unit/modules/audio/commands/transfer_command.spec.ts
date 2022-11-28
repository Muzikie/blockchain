import { TransferCommand } from '../../../../../src/app/modules/audio/commands/transfer_command';
import { AudioModule } from '../../../../../src/app/modules/audio/module'

describe('TransferCommand', () => {
  let command: TransferCommand;
  const module = new AudioModule()

  beforeEach(() => {
    command = new TransferCommand(module.stores, module.events);
  });

  describe('constructor', () => {
    it('should have valid name', () => {
      expect(command.name).toEqual('transfer');
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
