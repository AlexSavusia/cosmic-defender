export class Pool<T> {
    private items: T[] = [];

    constructor(private create: () => T) {}

    get(): T {
        return this.items.pop() ?? this.create();
    }

    release(item:T): void {
        this.items.push(item);
    }
}