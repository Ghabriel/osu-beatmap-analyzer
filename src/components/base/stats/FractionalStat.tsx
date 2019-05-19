import React from 'react';
import { createStyleSheet } from '../../../helpers/utilities';
import { PartialBar } from '../PartialBar';
import { Stat } from './Stat';

export interface FractionalStatProps {
    label: string;
    fraction: number;
}

const styles = createStyleSheet({
    value: {
        marginLeft: '10px',
    },
});

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
