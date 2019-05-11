import React from 'react';
import { merge } from '../helpers/merge';
import { colors } from '../helpers/style-variables';
import { StyleMap } from '../types/StyleMap';

export interface PartialBarProps {
    fraction: number;
}

const styles: StyleMap = {
    container: {
        border: `1px solid ${colors.secondaryBorder}`,
        display: 'flex',
        flexDirection: 'row',
        height: '10px',
        width: '120px',
    },

    filled: {
        backgroundColor: colors.primary,
        flexGrow: 0,
        flexShrink: 0,
    },

    empty: {
        flexGrow: 0,
        flexShrink: 0,
    }
};

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export const PartialBar: React.FunctionComponent<PartialBarProps> = props => {
    return (
        <div style={styles.container}>
            <div style={merge(
                styles.filled,
                { flexBasis: clamp(100 * props.fraction, 0, 100) + '%' }
            )}></div>

            <div style={merge(
                styles.empty,
                { flexBasis: clamp(100 * (1 - props.fraction), 0, 100) + '%' }
            )}></div>
        </div>
    );
};
