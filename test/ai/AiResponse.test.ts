import test from "node:test";
import assert from "node:assert/strict";

import { AiResponse } from "../../src/ai/AiResponse";

test("AiResponse.parseToolCall should parse a tool call correctly", () => {
    const response = new AiResponse(`
          <TOOL_CALL>
          name: check_weather
          args:
            city: Madrid
            country: Spain
          </TOOL_CALL>
        `);

    assert.equal(response.tag, "TOOL_CALL");

    assert.deepEqual(response.parseToolCall(), {
        tool: "check_weather",
        args: { city: "Madrid", country: "Spain" },
    });
});
