// Node.js built-in test runner version of the arrays util test.

import test from "node:test";
import assert from "node:assert/strict";

import { enumerateArray } from "../../src/utils/arrays";

test("enumerateArray groups in pairs", () => {
    const array = ["apple", "cat", 3];
    const result = enumerateArray(array);

    assert.equal(result, "1. apple\n2. cat\n3. 3");
});
