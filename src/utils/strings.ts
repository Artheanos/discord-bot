export function capitalize(str: string) {
    return str[0].toUpperCase() + str.substring(1);
}

export function isValidURL(url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}