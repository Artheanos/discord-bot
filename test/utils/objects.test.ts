import test from "node:test";
import assert from "node:assert/strict";

import { mergeObjects } from "../../src/utils/objects";

test("mergeObjects merges objects", () => {
    const obj = {
        index: 0,
        id: "1",
        type: "function",
        function: { name: "play_music", arguments: "{" },
    };
    mergeObjects(obj, {
        index: 0,
        function: { arguments: "}" },
    });

    assert.deepEqual(obj, {
        index: 0,
        id: "1",
        type: "function",
        function: { name: "play_music", arguments: "{}" },
    });
});
