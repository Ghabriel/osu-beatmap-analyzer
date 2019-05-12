import React from 'react';
import { StyleMap } from '../../../types/StyleMap';
import { PartialBar } from '../PartialBar';
import { Stat } from './Stat';

export interface FractionalStatProps {
    label: string;
    fraction: number;
}

const styles: StyleMap = {
    value: {
        marginLeft: '10px',
    },
};

export const FractionalStat: React.FC<FractionalStatProps> = ({ label, fraction, children }) => {
    return (
        <Stat label={label}>
            <PartialBar fraction={fraction} />

            <div style={styles.value}>
                {children}
            </div>
        </Stat>
    );
}
