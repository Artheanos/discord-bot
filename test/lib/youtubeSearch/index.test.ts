import { search } from "../../../src/lib/yt-dlp"
import { spawn } from "child_process"
import Mock = jest.Mock;
import { ReadableMock } from "../../helpers"

const spawnMock = spawn as Mock

jest.mock("child_process", () => ({
    spawn: jest.fn(),
}))

describe("search", () => {
    it("returns a list of videos", (done) => {
        const readable = new ReadableMock()
        spawnMock.mockImplementation(() => ({
            stdout: readable,
        }))

        search("a cool video", 5).then(result => {
            expect(spawnMock).toHaveBeenCalledWith(
                "yt-dlp",
                [
                    "ytsearch5:a cool video",
                    "--flat-playlist",
                    "--print",
                    "%(title)s\n%(url)s",
                ],
            )
            expect(result).toEqual([
                { url: "url1", title: "title1" },
                { url: "url2", title: "title2" },
                { url: "http://yt.com", title: "Movie" },
            ])
            done()
        })

        readable.dataListener("title1\nurl1")
        readable.dataListener("title2\nurl2")
        readable.dataListener("Movie\nhttp://yt.com")
        readable.closeListener()
    })
})
