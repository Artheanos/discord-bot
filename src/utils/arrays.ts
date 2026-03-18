export function enumerateArray(arr: unknown[]) {
    return arr.map((v, i) => `${i + 1}. ${v}`).join("\n");
}
