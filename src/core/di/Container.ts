type Factory<T> = (container: Container) => T;

export class Container {
    private static instance: Container;
    private services: Map<string, any> = new Map();
    private factories: Map<string, Factory<any>> = new Map();

    private constructor() { }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public register<T>(key: string, instance: T): void {
        this.services.set(key, instance);
    }

    public registerFactory<T>(key: string, factory: Factory<T>): void {
        this.factories.set(key, factory);
    }

    public resolve<T>(key: string): T {
        if (this.services.has(key)) {
            return this.services.get(key);
        }

        if (this.factories.has(key)) {
            const factory = this.factories.get(key);
            const instance = factory!(this);
            // Optionally cache singleton if desired, or keep generic for transient
            // For now, let's treat factories as singletons by default for services
            this.services.set(key, instance);
            return instance;
        }

        throw new Error(`Service not found: ${key}`);
    }

    public reset(): void {
        this.services.clear();
        this.factories.clear();
    }
}
