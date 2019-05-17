import React from 'react';
import { colors } from '../../helpers/style-variables';
import { merge } from '../../helpers/utilities';
import { StyleMap } from '../../types/StyleMap';

export interface ModProps {
    color?: string;
    selected?: boolean;
    blocked?: boolean;
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
        cursor: 'pointer',
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

    blocked: {
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        cursor: 'not-allowed',
        fontSize: '0.9rem',
    },

    modText: {
        flex: '1 1',
    },
};

export const Mod: React.FC<ModProps> = props => {
    return (
        <div
            style={merge(
                styles.mod,
                !!props.color && { backgroundColor: props.color },
                props.selected && styles.selected,
                props.blocked && styles.blocked,
            )}
            onClick={props.blocked ? undefined : props.onClick}
        >
            <div style={styles.modText}>
                {props.children}
            </div>
    </div>
    );
}
