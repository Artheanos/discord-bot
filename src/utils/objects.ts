export function mergeObjects(dst: any, obj1: any) {
    for (const [key, value] of Object.entries(obj1)) {
        if (typeof dst[key] === "object") {
            mergeObjects(
                dst[key] as Record<string, string>,
                value as Record<string, string>,
            );
            continue;
        }

        if (typeof dst[key] === "string") {
            dst[key] += value;
            continue;
        }

        dst[key] = value;
    }
}
