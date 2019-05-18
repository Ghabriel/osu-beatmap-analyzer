import React from 'react';
import { StyleMap } from '../../../types/StyleMap';

export interface StatProps {
    label: string;
}

const styles: StyleMap = {
    body: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },

    label: {
        fontWeight: 'bold',
        width: '150px',
    },
};

export const Stat: React.FC<StatProps> = ({ label, children }) => {
    return (
        <div style={styles.body}>
            <div style={styles.label} id='label-container'>
                {label}
            </div>

            {children}
        </div>
    );
}
