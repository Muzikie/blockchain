import { UpdateMembersCommand } from '../../../../../src/app/modules/subscription/commands/update_members_command';
import { SubscriptionModule } from '../../../../../src/app/modules/subscription/module';

describe('UpdateMembersCommand', () => {
  let command: UpdateMembersCommand;
  const module = new SubscriptionModule();

  beforeEach(() => {
    command = new UpdateMembersCommand(module.stores, module.events);
  });

  describe('constructor', () => {
    it('should have valid name', () => {
      expect(command.name).toBe('updateMembers');
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
