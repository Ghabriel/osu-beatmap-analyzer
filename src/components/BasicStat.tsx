import React from 'react';
import { propertyTableStyles } from '../styles/property-table';

export interface BasicStatProps {
    label: string;
    value: string | number | JSX.Element;
}

export const BasicStat: React.FunctionComponent<BasicStatProps> = ({ label: key, value }) => {
    return (
        <div style={propertyTableStyles.trait}>
            <div style={propertyTableStyles.traitKey}>
                {key}
            </div>

            <div style={propertyTableStyles.traitValue}>
                {value}
            </div>
        </div>
    );
}
