import React from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type InputProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    register: UseFormRegister<T>;
    error?: string;
    readOnly?: boolean;
    autoComplete?: string;
};

const Input = <T extends FieldValues>({
    label,
    name,
    type = 'text',
    placeholder,
    register,
    error,
    readOnly = false,
    autoComplete,
}: InputProps<T>): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-1.5 mb-5 relative">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{label}</label>
            <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                autoComplete={autoComplete}
                className={`outline-none px-4 py-2.5 text-xs sm:text-sm rounded-xl transition-all ${
                    error
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-[var(--text-primary)] focus:ring-2 focus:ring-rose-500/20'
                        : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 text-[var(--text-primary)] bg-[var(--bg-surface-subtle)]'
                } border ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-rose-500 text-xs mt-0.5">{error}</p>}
        </div>
    );
};

export default Input;
