export function getRandomItems(arr: any[], n: number) {
    if (n >= arr.length) return arr;
    const copy = [...arr];
    const result = [];
    while (result.length < n) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}