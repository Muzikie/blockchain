import { PurchaseCommand } from '../../../../../src/app/modules/subscription/commands/purchase_command';
import { SubscriptionModule } from '../../../../../src/app/modules/subscription/module';

describe('PurchaseCommand', () => {
  let command: PurchaseCommand;
  const module = new SubscriptionModule();

  beforeEach(() => {
    command = new PurchaseCommand(module.stores, module.events);
  });

  describe('constructor', () => {
    it('should have valid name', () => {
      expect(command.name).toEqual('purchase');
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
