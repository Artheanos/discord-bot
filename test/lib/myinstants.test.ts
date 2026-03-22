import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";

import axios from "axios";
import { findMp3Paths } from "../../src/lib/myinstants";

// Manual axios mock (no Jest).
// We mutate axios.get for the duration of the test and restore it afterwards.
type AxiosGet = typeof axios.get;

const expectedMp3s = [
    "/media/sounds/szatanie-moja-dupa.mp3",
    "/media/sounds/gdzie-jest-dupa.mp3",
    "/media/sounds/odupadupadupa.mp3",
    "/media/sounds/marinette-dupain-cheng-lucky-charm.mp3",
    "/media/sounds/marinette-dupain-cheng-miraculous.mp3",
    "/media/sounds/flecma.mp3",
    "/media/sounds/jedna-poda-dupa-mniej.mp3",
    "/media/sounds/dupa_iRIFUWQ.mp3",
];

test("findMp3s finds mp3s", async () => {
    const originalGet: AxiosGet = axios.get;

    try {
        const fixtureHtml = fs
            .readFileSync("./test/fixtures/myinstants-1.html")
            .toString();

        axios.get = (async () => ({
            data: fixtureHtml,
        })) as unknown as AxiosGet;

        const result = await findMp3Paths("dupa");
        assert.deepEqual(result, expectedMp3s);
    } finally {
        axios.get = originalGet;
    }
});
