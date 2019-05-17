import React from 'react';
import { colors } from '../../helpers/style-variables';
import { merge } from '../../helpers/utilities';
import { StyleMap } from '../../types/StyleMap';

export interface ModProps {
    color?: string;
    selected?: boolean;
    onClick: () => void;
}

const styles: StyleMap = {
    mod: {
        alignItems: 'center',
        borderColor: colors.secondaryBorder,
        borderStyle: 'solid',
        borderRadius: '3px',
        borderWidth: '1px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        height: '2rem',
        margin: '5px 5px',
        textAlign: 'center',
        width: '60px',
    },

    selected: {
        borderWidth: '3px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },

    modText: {
        flex: '1 1',
    },
};

export const Mod: React.FC<ModProps> = ({ color, children, selected, onClick }) => {
    return (
        <div
            style={merge(
                styles.mod,
                !!color && { backgroundColor: color },
                selected && styles.selected,
            )}
            onClick={onClick}
        >
            <div style={styles.modText}>
                {children}
            </div>
    </div>
    );
}
