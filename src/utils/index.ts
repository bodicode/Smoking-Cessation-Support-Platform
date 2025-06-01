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

export function safeT(t: any, key: string) {
  try {
    const val = t(key);
    if (val === key) return undefined;
    return val;
  } catch {
    return undefined;
  }
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}