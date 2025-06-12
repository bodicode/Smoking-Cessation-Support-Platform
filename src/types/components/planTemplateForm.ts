import { ChangeEvent, FormEvent } from "react";

export type PlanTemplateFormProps = {
    form: {
        name: string;
        description: string;
        difficulty_level: "" | "EASY" | "MEDIUM" | "HARD";
        estimated_duration_days: string;
    };
    loading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    editId?: string | null;
};