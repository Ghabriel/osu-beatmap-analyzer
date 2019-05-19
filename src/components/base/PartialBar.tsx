import React from 'react';
import { colors } from '../../helpers/style-variables';
import { clamp, createStyleSheet, merge } from '../../helpers/utilities';

export interface PartialBarProps {
    fraction: number;
}

const styles = createStyleSheet({
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
});

export const PartialBar: React.FC<PartialBarProps> = props => {
    const filledPercentage = 100 * clamp(props.fraction, 0, 1);

    const filledStyle = merge(styles.filled, { flexBasis: filledPercentage + '%' });
    const emptyStyle = merge(styles.empty, { flexBasis: (100 - filledPercentage) + '%' });

    return (
        <div style={styles.container}>
            <div style={filledStyle}></div>
            <div style={emptyStyle}></div>
        </div>
    );
};
