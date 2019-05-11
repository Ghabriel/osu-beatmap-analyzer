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

export const PartialBar: React.FunctionComponent<PartialBarProps> = props => {
    return (
        <div style={styles.container}>
            <div style={merge(
                styles.filled,
                { flexBasis: (100 * props.fraction) + '%' }
            )}></div>

            <div style={merge(
                styles.empty,
                { flexBasis: (100 * (1 - props.fraction)) + '%' }
            )}></div>
        </div>
    );
};
