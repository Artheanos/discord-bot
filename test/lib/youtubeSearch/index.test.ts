/// <reference types="node" />

import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import * as childProcess from "node:child_process";
import { createRequire } from "node:module";

/**
 * Why this test is written this way:
 * - Production code imports `spawn` via `import { spawn } from "child_process"`.
 *   That captures the function reference at module evaluation time.
 * - So we must patch `child_process.spawn` BEFORE the module under test is evaluated.
 * - Additionally, Node may cache already-evaluated modules across tests, so we clear the
 *   CommonJS require cache for the relevant modules before loading them.
 *
 * We use CJS loading (`createRequire`) intentionally so we can reliably clear the cache
 * (ESM module cache is not directly controllable).
 */

const require = createRequire(import.meta.url);

test("search returns a list of videos", async () => {
    const originalSpawn = childProcess.spawn;

    // Capture spawn invocation for assertions.
    let calledCommand: string | undefined;
    let calledArgs: readonly string[] | undefined;

    // Use a real Readable so `readStdout` attaches listeners like in production.
    const stdout = new Readable({
        read() {
            // no-op; we'll push manually
        },
    });

    try {
        // Patch spawn BEFORE requiring the module under test.
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

        // Clear require cache so the module re-evaluates and captures our patched spawn.
        // (Paths are resolved through Node's resolution to absolute filenames in `require.cache`.)
        const indexPath = require.resolve("../../../src/lib/yt-dlp");
        const searchPath = require.resolve("../../../src/lib/yt-dlp/search");
        const utilsPath = require.resolve("../../../src/lib/yt-dlp/utils");

        delete require.cache[indexPath];
        delete require.cache[searchPath];
        delete require.cache[utilsPath];

        // Load after patching spawn + clearing cache.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { search } =
            require("../../../src/lib/yt-dlp") as typeof import("../../../src/lib/yt-dlp");

        const promise: Promise<Array<{ title: string; url: string }>> = search(
            "a cool video",
            5,
        );

        // Simulate yt-dlp output (each chunk is "title\nurl").
        stdout.push("title1\nurl1");
        stdout.push("title2\nurl2");
        stdout.push("Movie\nhttp://yt.com");
        stdout.emit("close");

        const result = await promise;

        assert.equal(calledCommand, "yt-dlp");
        assert.deepEqual(calledArgs, [
            "ytsearch5:a cool video",
            "--flat-playlist",
            "--print",
            "%(title)s\n%(url)s",
        ]);

        assert.deepEqual(result, [
            { url: "url1", title: "title1" },
            { url: "url2", title: "title2" },
            { url: "http://yt.com", title: "Movie" },
        ]);
    } finally {
        // Restore spawn even if the test fails.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (childProcess as any).spawn = originalSpawn;
    }
});
