import React from 'react';

type ButtonProps = {
    isSubmitting: boolean;
    loading: string;
    text: string;
};

const Button = ({ isSubmitting, loading, text }: ButtonProps): React.JSX.Element => {
    return (
        <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 mt-3 shadow-md shadow-blue-500/20 ${
                isSubmitting
                    ? 'bg-blue-600/70 cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer hover:-translate-y-0.5'
            }`}
        >
            {isSubmitting ? loading : text}
        </button>
    );
};

export default Button;
