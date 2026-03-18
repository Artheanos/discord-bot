import * as configJson from "./config.json";
import { PresenceData } from "discord.js";

type ConfigJson = typeof configJson & {
    ownerId: string;
    token: string;
    youtubeApiKey?: string;
    defaultPresence: PresenceData;
    censorList: {
        [key: string]: {
            [key: string]: string[];
        };
    };
    dbUrl: string;
};

export default configJson as ConfigJson;
