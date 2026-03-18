import { BaseCommand } from "commands/BaseCommand";
import { DeleteCommand } from "commands/DeleteCommand";
import { DisconnectCommand } from "commands/DisconnectCommand";
import { EvalCommand } from "commands/EvalCommand";
import { JoinCommand } from "commands/JoinCommand";
import { ListSavedCommand } from "commands/ListSavedCommand";
import { LolCommand } from "commands/LolCommand";
import { MyInstantsCommand } from "commands/MyInstantsCommand";
import { PauseCommand } from "commands/PauseCommand";
import { PlayCommand } from "commands/PlayCommand";
import { PlaySavedCommand } from "commands/PlaySavedCommand";
import { QueueCommand } from "commands/QueueCommand";
import { RenameCommand } from "commands/RenameCommand";
import { Rule34Command } from "commands/Rule34Command";
import { SaveCommand } from "commands/SaveCommand";
import { SearchCommand } from "commands/SearchCommand";
import { ShutdownCommand } from "commands/ShutdownCommand";
import { SkipCommand } from "commands/SkipCommand";
import { UnpauseCommand } from "commands/UnpauseCommand";

export const routes: Record<string, Type<BaseCommand>> = {
    "delete":     DeleteCommand,
    "disconnect": DisconnectCommand,
    "leave":      DisconnectCommand,
    "eval":       EvalCommand,
    "join":       JoinCommand,
    "list":       ListSavedCommand,
    "lol":        LolCommand,
    "lolek":      LolCommand,
    "pause":      PauseCommand,
    "play":       PlayCommand,
    "p":          PlayCommand,
    "rename":     RenameCommand,
    "rule34":     Rule34Command,
    "queue":      QueueCommand,
    "save":       SaveCommand,
    "saved":      PlaySavedCommand,
    "shutdown":   ShutdownCommand,
    "search":     SearchCommand,
    "skip":       SkipCommand,
    "next":       SkipCommand,
    "unpause":    UnpauseCommand,
    "resume":     UnpauseCommand,
    "routes":     Rule34Command,
    "myinstants": MyInstantsCommand,
    "mi":         MyInstantsCommand,
};
