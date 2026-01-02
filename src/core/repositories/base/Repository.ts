export interface IRepository<T> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<T[]>;
}

export abstract class BaseRepository<T> implements IRepository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract save(entity: T): Promise<void>;
    abstract delete(id: string): Promise<void>;
    abstract findAll(): Promise<T[]>;
}
