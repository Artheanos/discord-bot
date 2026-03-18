import { spawn } from "child_process"
import { readStdout } from "lib/yt-dlp/utils"

export const getTitle = async (url: string): Promise<string> => {
    const command = `${url} --print title`
    const cmd = spawn("yt-dlp", command.split(" "))
    return (await readStdout(cmd.stdout))[0]
}
