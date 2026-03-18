import { Awaitable, ClientEvents } from "discord.js"

export type ClientEventListener<T extends keyof ClientEvents> = (...args: ClientEvents[T]) => Awaitable<void>
