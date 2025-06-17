import { BadgeRequirement } from "@/types/api/badgeRequirement";
import { useEffect } from "react";

interface Props {
    criteriaType: string;
    value: string;
    onChange: (val: string) => void;
}

export default function RequirementForm({ criteriaType, value, onChange }: Props) {
    let initial: any = {};
    try { initial = value ? JSON.parse(value) : {}; } catch { initial = {}; }

    useEffect(() => {
        if (criteriaType === "first_plan_created") {
            onChange(JSON.stringify({ criteria_type: "first_plan_created" }));
        }
    }, [criteriaType]);

    // Task completed at a specific time
    if (criteriaType === "task_completed_at_time") {
        const time_before = initial?.condition?.time_before || "09:00";
        return (
            <div>
                <label>Thời gian hoàn thành trước (HH:mm):</label>
                <input
                    type="time"
                    value={time_before}
                    onChange={e => {
                        const obj: BadgeRequirement = {
                            criteria_type: "task_completed_at_time",
                            event_type: "task_completed",
                            condition: { time_before: e.target.value }
                        };
                        onChange(JSON.stringify(obj));
                    }}
                    className="border px-2 py-1 rounded w-32"
                />
            </div>
        );
    }

    // Streak achieved
    if (criteriaType === "streak_achieved") {
        const days = initial?.days ?? "";
        return (
            <div>
                <label>Số ngày liên tục:</label>
                <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={e => {
                        const obj: BadgeRequirement = {
                            criteria_type: "streak_achieved",
                            days: Number(e.target.value)
                        };
                        onChange(JSON.stringify(obj));
                    }}
                    className="border px-2 py-1 rounded w-20"
                />
            </div>
        );
    }

    // First plan created (no input)
    if (criteriaType === "first_plan_created") {
        return <div className="text-green-700 font-medium">Không cần điều kiện thêm</div>;
    }

    return null;
}
