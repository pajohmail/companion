import { Entity } from '../../../../core/entities/base/Entity';

interface TestProps {
    name: string;
}

class TestEntity extends Entity<TestProps> {
    public name: string;
    constructor(props: TestProps, id?: string) {
        super(props, id);
        this.name = props.name;
    }
}

describe('Base Entity', () => {
    it('should generate id if not provided', () => {
        const entity = new TestEntity({ name: 'test' });
        expect(entity.id).toBeDefined();
        expect(entity.createdAt).toBeDefined();
    });

    it('should use provided id', () => {
        const id = '123';
        const entity = new TestEntity({ name: 'test' }, id);
        expect(entity.id).toBe(id);
    });
});
