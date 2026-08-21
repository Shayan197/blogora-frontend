import React from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type GenderProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: string;
};

const Gender = <T extends FieldValues>({
    label,
    name,
    register,
    error,
}: GenderProps<T>): React.JSX.Element => {
    return (
        <div className="flex flex-col gap-2 mb-5 relative">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{label}</label>
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Male', val: 'male' },
                    { label: 'Female', val: 'female' },
                    { label: 'Other', val: 'other' },
                ].map((item) => (
                    <label
                        key={item.val}
                        className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] cursor-pointer transition-colors"
                    >
                        <input
                            type="radio"
                            value={item.val}
                            {...register(name)}
                            className="text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                        />
                        <span>{item.label}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-rose-500 text-xs mt-0.5">{error}</p>}
        </div>
    );
};

export default Gender;
