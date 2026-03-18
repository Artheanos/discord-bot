import { Readable } from "stream"

export const readStdout = (readable: Readable): Promise<string[]> => {
    return new Promise((resolve) => {
        const result: string[] = []
        readable.on("data", (buffer: Buffer) => result.push(buffer.toString()))
        readable.on("close", () => resolve(result))
    })
}
