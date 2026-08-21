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
        className={`size-12 text-center border-2 rounded-lg outline-none text-xl transition-colors
            ${error && !value ? 'border-red-300' : 'border-gray-300'}
            focus:border-customJamni focus:ring-2 focus:ring-customJamni/40`}
    />
);

export default OtpInput;
