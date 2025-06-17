// --- Định nghĩa các kiểu dữ liệu cụ thể cho từng loại criteria_type ---

/** Yêu cầu hoàn thành task trước một thời điểm cụ thể trong ngày */
export interface TaskCompletedAtTimeRequirement {
    criteria_type: 'task_completed_at_time';
    event_type: 'task_completed';
    condition: {
        time_before: string; // Định dạng "HH:mm", ví dụ "09:00"
    };
}

/** Yêu cầu đạt được chuỗi ngày liên tục */
export interface StreakAchievedRequirement {
    criteria_type: 'streak_achieved';
    days: number; // Số ngày liên tục
}

/** Yêu cầu tạo kế hoạch đầu tiên */
export interface FirstPlanCreatedRequirement {
    criteria_type: 'first_plan_created';
    // Không có trường bổ sung
}

// Union type
export type BadgeRequirement =
    | TaskCompletedAtTimeRequirement
    | StreakAchievedRequirement
    | FirstPlanCreatedRequirement;

// --- Metadata cho dynamic form FE ---

export interface BadgeCriteriaField {
    name: string;                // Tên thuộc tính trong JSON (vd: 'days', 'time_before')
    label: string;               // Nhãn trên UI
    type: 'number' | 'text' | 'time';
    defaultValue?: any;
    nestedPath?: string;         // Đường dẫn cho field lồng nhau, vd: 'condition.time_before'
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
        pattern?: string;
    };
}

export interface BadgeCriteriaTypeConfig {
    value: BadgeRequirement['criteria_type'];
    label: string;
    fields: BadgeCriteriaField[];
}

export const BADGE_CRITERIA_CONFIGS: BadgeCriteriaTypeConfig[] = [
    {
        value: 'task_completed_at_time',
        label: 'Task Completed At Time',
        fields: [
            {
                name: 'time_before',
                label: 'Thời gian hoàn thành trước (HH:mm)',
                type: 'time',
                nestedPath: 'condition.time_before',
                defaultValue: '09:00',
                validation: { required: true, pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' }
            }
        ]
    },
    {
        value: 'streak_achieved',
        label: 'Streak Achieved',
        fields: [
            {
                name: 'days',
                label: 'Số ngày liên tục',
                type: 'number',
                defaultValue: 7,
                validation: { required: true, min: 1 }
            }
        ]
    },
    {
        value: 'first_plan_created',
        label: 'First Plan Created',
        fields: []
    }
];

