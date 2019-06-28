import React from 'react';

export interface StatProps {
    label: string;
}

export const Stat: React.FC<StatProps> = ({ label, children }) => {
    return (
        <div className="stat">
            <div className="label" id="label-container">
                {label}
            </div>

            {children}
        </div>
    );
}
