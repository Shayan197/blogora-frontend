import React, { useState } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
    const isPasswordField = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (isPasswordField) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '••••••••••••');
            toast.error('Password copying is disabled for security');
        }
    };

    const handleCut = (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (isPasswordField) {
            e.preventDefault();
            toast.error('Cutting password is disabled for security');
        }
    };

    return (
        <div className="flex flex-col gap-1.5 mb-5 relative">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{label}</label>
            <div className="relative flex items-center">
                <input
                    {...register(name)}
                    type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    onCopy={handleCopy}
                    onCut={handleCut}
                    className={`w-full outline-none px-4 py-2.5 text-xs sm:text-sm rounded-xl transition-all ${
                        isPasswordField ? 'pr-11' : ''
                    } ${
                        error
                            ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-[var(--text-primary)] focus:ring-2 focus:ring-rose-500/20'
                            : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 text-[var(--text-primary)] bg-[var(--bg-surface-subtle)]'
                    } border ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                />

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        tabIndex={-1}
                        title={isPasswordVisible ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md focus:outline-none cursor-pointer"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                        {isPasswordVisible ? (
                            <FiEyeOff className="w-4 h-4" />
                        ) : (
                            <FiEye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error && <p className="text-rose-500 text-xs mt-0.5">{error}</p>}
        </div>
    );
};

export default Input;
