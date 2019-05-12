import React from 'react';
import { propertyTableStyles } from '../../../styles/property-table';

export interface BasicStatProps {
    label: string;
    value: string | number | JSX.Element;
}

export const BasicStat: React.FC<BasicStatProps> = ({ label, value }) => {
    return (
        <div style={propertyTableStyles.trait}>
            <div style={propertyTableStyles.traitKey}>
                {label}
            </div>

            <div style={propertyTableStyles.traitValue}>
                {value}
            </div>
        </div>
    );
}
