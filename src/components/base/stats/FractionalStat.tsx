import React from 'react';
import { propertyTableStyles } from '../../../styles/property-table';
import { PartialBar } from '../PartialBar';

export interface FractionalStatProps {
    label: string;
    value: string | number | JSX.Element;
    fraction: number;
}

export const FractionalStat: React.FC<FractionalStatProps> = ({ label, value, fraction }) => {
    return (
        <div style={propertyTableStyles.trait}>
            <div style={propertyTableStyles.traitKey}>
                {label}
            </div>

            <PartialBar fraction={fraction} />

            <div style={propertyTableStyles.traitValue}>
                {value}
            </div>
        </div>
    );
}
