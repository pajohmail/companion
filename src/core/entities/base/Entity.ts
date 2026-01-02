export abstract class Entity<T> {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(props: T, id?: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id || crypto.randomUUID();
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
        Object.assign(this, props);
    }

    public toJSON(): object {
        return {
            ...this, // Spread first
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}
