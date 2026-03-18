import { spawn } from "child_process"
import { Readable } from "stream"

export const stream = (url: string, audioFormat = "opus"): Readable => {
    const command = `-f ba --audio-format=${audioFormat} -o - ${url}`
    const cmd = spawn("yt-dlp", command.split(" "))
    return cmd.stdout
}
