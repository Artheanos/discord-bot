# This is a discord bot written in TypeScript
## Setup

### [Supply the discord token](#Configuration)
### Native

* Install [yt-dlp](https://github.com/yt-dlp/yt-dlp)
* Install dependencies - run `npm i` while in the project's folder
* Compile js - `npm run build`
* Run it! - `npm run start`

#### The bot should be running now

### Docker

* Build an image - `docker build -t tsbot .`
* Run the image - `docker run -d --name tsbot-container tsbot`

#### The bot should now be running on a docker container

## Configuration

* Go to the `$APP_ROOT/config`
* Copy `config_example.json` to `config.json`
* Edit `config/config.json` file

The only field you have to change is the bot's token
```json5
{
  "prefix": "$",          // Only commands following the prefix will work
  "token": "1234",        // Your bot's discord Token
  "ownerId": "4321",      // Your discord account ID
  "caseSensitive": false  // Case sensitivity of commands
}
```
Note that if you don't specify ownerId, "ownerOnly" commands won't work

## Censor List
`bot/config/censor_list.json` contains guilds and channels with banned words

The structure is as follows
```json5
{
  "guildId": {
    "textChannelId": [
      "word1", "word2"
    ]
  }
}
```
You can also replace guild id or text channel id with an asterisk `*`.

If you do so then its value will be applied to any guild id / text channel id that **has not** been matched

Example `censor_list.json`
```json5
{
 // This guild will be banning "bad_word" and messages containing 7 consecutive characters 
 // on every text channel except for 207085530130229581
 "067680738097511020": { 
   "*": [
     "(.)(\\1){6}",
     "bad_word"
   ],
   "207085530130229581": []
 }
}
```

Adding your own commands
---
`src/commands` folder contains the bot's commands.
The command's action is then executed if the user's input has been matched with the command's route.
The routing is specified in the `src/routes.ts` file.

See `src/bot/commands/DisconnectCommand.ts` as an example
```ts
export class DisconnectCommand extends BaseCommand {
    static description = 'Disconnect command'

    action() {
        getVoiceConnection(this.guild.id)?.disconnect()
    }
}

```

`src/routes.ts`
```ts
export const routes: Record<string, Type<BaseCommand>> = {
    'delete':     DeleteCommand,
    'disconnect': DisconnectCommand,
    'leave':      DisconnectCommand,
    'eval':       EvalCommand,
    ...
}
```
