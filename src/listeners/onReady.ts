import { PresenceData } from "discord.js"
import config from "config"
import { ClientEventListener } from "./types"

const onReady: ClientEventListener<"ready"> = (client) => {
    client.user!.setPresence(config.defaultPresence as PresenceData)
    import("cron")
}

export default onReady
