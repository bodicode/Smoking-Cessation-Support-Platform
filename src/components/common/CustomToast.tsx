'use client'

import { ToastBar, Toaster } from "react-hot-toast";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

export default function ToasterClient() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{ duration: 3000 }}
        >
            {(t) => (
                <ToastBar
                    toast={t}
                    style={{
                        ...t.style,
                        animation: t.visible
                            ? 'custom-in 0.7s cubic-bezier(.4,0,.2,1)'
                            : 'custom-out 0.5s cubic-bezier(.4,0,.2,1) forwards',
                    }}
                />
            )}
        </Toaster>
    );
}

export function SuccessToast({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg shadow">
            <FiCheckCircle className="text-green-500 w-5 h-5" />
            <span className="">{message}</span>
        </div>
    );
}

export function ErrorToast({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-300 rounded-lg shadow">
            <FiAlertTriangle className="text-red-500 w-5 h-5" />
            <span className="">{message}</span>
        </div>
    );
}
