import { enumerateArray } from "../../src/utils/arrays";

describe("enumerateArray", () => {
    it("groups in pairs", () => {
        const array = ["apple", "cat", 3];
        const result = enumerateArray(array);
        expect(result).toEqual("1. apple\n2. cat\n3. 3");
    });
});
