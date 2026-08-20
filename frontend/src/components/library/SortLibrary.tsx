import { ArrowsUpDownIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { sortOptions, type SortOption } from "../../interfaces/SortOption";
import { useEffect, useRef, useState } from "react";


export default function SortLibrary({ sort, onChange }: {sort: SortOption, onChange: (sort: SortOption) => void }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentLabel = sortOptions.find((opt) => opt.value === sort)?.label;

    return (
        <div
        ref={menuRef}
        className="fixed top-20 right-4 sm:right-6 lg:right-8 z-30"
        >
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full pl-3 pr-2.5 py-1.5 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
        >
            <ArrowsUpDownIcon className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium max-w-35 truncate">
                {currentLabel}
            </span>
            <ChevronDownIcon
                className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            />
        </button>

        {open && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow-lg py-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <p className="px-4 pb-2 mb-1 text-xs font-semibold text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                Ordenar por
            </p>
            {sortOptions.map((opt) => (
                <button
                key={opt.value}
                onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                }}
                className="w-full flex items-center justify-between text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                {opt.label}
                {opt.value === sort && (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                )}
                </button>
            ))}
            </div>
        )}
        </div>
    );
}