export class ReadableMock {
    _listeners: Record<string, unknown> = {}

    get dataListener(): (buffer: string) => void {
        return this._listeners["data"] as (buffer: string) => void
    }

    get closeListener(): () => void {
        return this._listeners["close"] as () => void
    }

    on(event: string, listener: unknown): this {
        this._listeners[event] = listener
        return this
    }
}
