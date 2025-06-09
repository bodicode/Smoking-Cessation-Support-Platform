import { ReactNode } from "react";

export interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}
