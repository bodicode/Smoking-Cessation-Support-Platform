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
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function translateDifficulty(level: string) {
  switch (level) {
    case "EASY":
      return "Dễ";
    case "MEDIUM":
      return "Trung bình";
    case "HARD":
      return "Khó";
    default:
      return "Không xác định";
  }
}

export function translatePlanStatus(status: string) {
  switch (status) {
    case "PLANNING":
      return "Lên kế hoạch";
    case "ACTIVE":
      return "Bắt đầu";
    // case "PAUSED":
    //   return "Tạm dừng";
    case "COMPLETED":
      return "Hoàn thành";
    // case "ABANDONED":
    //   return "Bỏ dở";
    case "CANCELLED":
      return "Hủy";
    default:
      return status;
  }
}

export function translateStageStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "Chưa bắt đầu";
    case "ACTIVE":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Hoàn thành";
    case "SKIPPED":
      return "Bỏ qua";
    default:
      return status;
  }
}

export function getAvailablePlanStatusTransitions(current: string) {
  switch (current) {
    case "PLANNING":
      return ["ACTIVE", "CANCELLED", "ABANDONED"];
    case "ACTIVE":
      return ["PAUSED", "COMPLETED", "CANCELLED", "ABANDONED"];
    case "PAUSED":
      return ["ACTIVE", "CANCELLED", "ABANDONED"];
    default:
      return []; // COMPLETED, ABANDONED, CANCELLED: không cho chuyển nữa
  }
}

export function getAvailableStageStatusTransitions(current: string) {
  switch (current) {
    case "PENDING":
      return ["ACTIVE", "SKIPPED"];
    case "ACTIVE":
      return ["COMPLETED", "SKIPPED"];
    default:
      return [];
  }
}
