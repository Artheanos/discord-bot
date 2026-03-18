import { getTitle } from "../../../src/lib/yt-dlp";

import { spawn } from "child_process";
import Mock = jest.Mock;
import { ReadableMock } from "../../helpers";

const spawnMock = spawn as Mock;

jest.mock("child_process", () => ({
    spawn: jest.fn(),
}));

describe("getTitle", () => {
    it("executes yt-dlp", async () => {
        const readable = new ReadableMock();
        spawnMock.mockImplementation(() => ({
            stdout: readable,
        }));
        getTitle("https://www.youtube.com/watch?v=fwlTGuOxfoA").then(result => {
            expect(result).toEqual("Video Title!");
        });
        readable.dataListener("Video Title!");
        readable.dataListener("Some data");
        readable.closeListener();
    });
});
