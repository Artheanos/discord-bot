export class ReadableMock {
    _listeners: Record<string, unknown> = {};

    get dataListener(): (buffer: string) => void {
        return this._listeners["data"] as (buffer: string) => void;
    }

    get closeListener(): () => void {
        return this._listeners["close"] as () => void;
    }

    on(event: string, listener: unknown): this {
        this._listeners[event] = listener;
        return this;
    }

    emitData(buffer: string): void {
        const listener = this._listeners["data"];
        if (typeof listener !== "function") {
            throw new TypeError('ReadableMock: no "data" listener registered');
        }
        (listener as (buffer: string) => void)(buffer);
    }

    emitClose(): void {
        const listener = this._listeners["close"];
        if (typeof listener !== "function") {
            throw new TypeError('ReadableMock: no "close" listener registered');
        }
        (listener as () => void)();
    }
}
