import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";

// Patch `child_process.spawn` BEFORE importing the module under test.
// The production code does `import { spawn } from "child_process"`, which captures
// the reference at import time. If we patched after importing, our mock wouldn't be used.
//
// We use dynamic import to control evaluation order.
import * as childProcess from "node:child_process";

test("getTitle executes yt-dlp", async () => {
    const originalSpawn = childProcess.spawn;

    try {
        // Capture call args for assertions
        let calledCommand: string | undefined;
        let calledArgs: readonly string[] | undefined;

        // Create a real Readable so `readStdout` can attach listeners normally.
        const stdout = new Readable({
            read() {
                // no-op; we'll push manually
            },
        });

        // Patch spawn
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (childProcess as any).spawn = ((
            command: string,
            args?: readonly string[],
        ) => {
            calledCommand = command;
            calledArgs = args;

            return { stdout };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;

        // Import after patching spawn
        const { getTitle } = await import("../../../src/lib/yt-dlp");

        // Start work
        const promise = getTitle("https://www.youtube.com/watch?v=fwlTGuOxfoA");

        // Emit stdout data + close to resolve `readStdout`
        stdout.push("Video Title!");
        stdout.emit("close");

        const result = await promise;

        assert.equal(result, "Video Title!");
        assert.equal(calledCommand, "yt-dlp");

        // getTitle builds args by splitting `${url} --print title`
        assert.deepEqual(calledArgs, [
            "https://www.youtube.com/watch?v=fwlTGuOxfoA",
            "--print",
            "title",
        ]);
    } finally {
        // Restore spawn
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (childProcess as any).spawn = originalSpawn;
    }
});
