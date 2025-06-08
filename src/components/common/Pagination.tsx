'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNext?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNext = true
}: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-3">
            <button
                className="cursor-pointer px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition disabled:opacity-60"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft />
            </button>
            <span className="font-semibold text-gray-700">
                Trang {currentPage} / {totalPages || 1}
            </span>
            <button
                className="cursor-pointer px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold transition disabled:opacity-60"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || !hasNext}
            >
                <ChevronRight />
            </button>
        </div>
    );
}
