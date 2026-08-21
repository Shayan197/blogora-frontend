import React from 'react';

type Head = {
    name: string;
};

const H1 = ({ name }: Head): React.JSX.Element => {
    return (
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-center mb-4 text-[var(--text-primary)] tracking-tight">
            {name}
        </h1>
    );
};

export default H1;
