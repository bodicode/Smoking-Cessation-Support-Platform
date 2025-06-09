import { BreadcrumbsProps } from "@/types/components/breadCrumb";
import Link from "next/link";

export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center text-gray-500 text-sm mb-4" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center">
                    {item.href ? (
                        <Link href={item.href} className={item.active ? "text-sky-700 font-semibold" : "hover:underline"}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-sky-700 font-semibold">{item.label}</span>
                    )}
                    {idx < items.length - 1 && <span className="mx-2">/</span>}
                </span>
            ))}
        </nav>
    );
}