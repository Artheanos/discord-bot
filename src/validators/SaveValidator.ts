import { isValidURL } from "utils/strings"
import { BaseValidator } from "validators/BaseValidator"

export class SaveValidator extends BaseValidator {

    call(): string | undefined {
        switch (this.command.args.length) {
        case 1:
            return this.validateFile()
        case 2:
            return this.validateUrl()
        }
    }

    private validateFile(): string | undefined {
        const track = this.command.message.attachments.first()
        if (!track) {
            return "This command requires an audio attachment"
        }

        if (!track.contentType?.startsWith("audio/")) {
            return "This attachment is not an audio file"
        }
    }

    private validateUrl(): string | undefined {
        if (!isValidURL(this.command.args[1])) {
            return "This is not a valid url"
        }
    }
}