import { SetAttributesCommand } from '../../../../../src/app/modules/audio/commands/set_attributes_command';
import { AudioModule } from '../../../../../src/app/modules/audio/module';

describe('SetAttributeCommand', () => {
  let command: SetAttributesCommand;
  const module = new AudioModule();

  beforeEach(() => {
    command = new SetAttributesCommand(module.stores, module.events);
  });

  describe('constructor', () => {
    it('should have valid name', () => {
      expect(command.name).toBe('setAttributes');
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
