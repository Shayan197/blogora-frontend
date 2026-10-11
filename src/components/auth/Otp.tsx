import React from 'react';

type OtpInputProps = {
    value: string;
    idx: number;
    handleChange: (value: string, idx: number) => void;
    inputsRef: React.MutableRefObject<HTMLInputElement[]>;
    error?: string;
};

const OtpInput = ({ value, idx, handleChange, inputsRef, error }: OtpInputProps) => (
    <input
        value={value}
        maxLength={1}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
        ref={(el) => {
            if (el) inputsRef.current[idx] = el;
        }}
        onChange={(e) => handleChange(e.target.value, idx)}
        onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value && idx > 0) {
                inputsRef.current[idx - 1]?.focus();
            }
        }}
        className={`size-10 sm:size-12 text-center border-2 rounded-xl outline-none text-lg sm:text-xl font-bold transition-all bg-[var(--bg-surface)] text-[var(--text-primary)]
            ${error && !value ? 'border-rose-400' : 'border-[var(--border-subtle)]'}
            focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/30`}
    />
);

export default OtpInput;
