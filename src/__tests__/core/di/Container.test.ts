import { Container } from '../../../core/di/Container';

describe('Container', () => {
    let container: Container;

    beforeEach(() => {
        container = Container.getInstance();
        container.reset();
    });

    it('should register and resolve a service instance', () => {
        const service = { doSomething: () => 'done' };
        container.register('MyService', service);

        const resolved = container.resolve<{ doSomething: () => string }>('MyService');
        expect(resolved).toBe(service);
        expect(resolved.doSomething()).toBe('done');
    });

    it('should register and resolve a factory', () => {
        const factory = () => ({ value: 1 });
        container.registerFactory('MyFactory', factory);

        const resolved = container.resolve<{ value: number }>('MyFactory');
        expect(resolved.value).toBe(1);
    });

    it('should throw error if service not found', () => {
        expect(() => container.resolve('Unknown')).toThrow('Service not found: Unknown');
    });
});
