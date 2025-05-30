import React from "react";

const Loading = ({
    size = 24,
    color = "#fff",
    className = "",
}) => (
    <svg
        className={`animate-spin ${className}`}
        style={{ width: size, height: size }}
        viewBox="0 0 24 24"
        fill="none"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="4"
        />
        <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-75"
        />
    </svg>
);

export default Loading;
