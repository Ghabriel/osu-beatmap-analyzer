import React from 'react';
import { colors } from '../../helpers/style-variables';
import { merge } from '../../helpers/utilities';
import { Color } from '../../types/Color';
import { StyleMap } from '../../types/StyleMap';

export interface HitObjectProps {
    backgroundColor: Color;
}

const styles: StyleMap = {
    outerLayer: {
        border: `1px solid ${colors.secondaryDark}`,
        borderRadius: '50%',
        display: 'inline-block',
    },

    innerLayer: {
        border: '3px solid white',
        borderRadius: '50%',
        display: 'inline-block',
    },

    circle: {
        alignItems: 'center',
        border: `1px solid ${colors.secondaryBorder}`,
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'row',
        height: '50px',
        textAlign: 'center',
        width: '50px',
    },

    text: {
        color: 'white',
        flex: '1 1',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        textShadow: `
            black -1px -1px 1px,
            black -1px 1px 1px,
            black 1px -1px 1px,
            black 1px 1px 1px
        `,
    },
};

export const HitObject: React.FC<HitObjectProps> = ({ backgroundColor }) => {
    const { red, green, blue, alpha } = backgroundColor;

    return (
        <div style={styles.outerLayer}>
            <div style={styles.innerLayer}>
                <div
                    id='circle'
                    style={merge(
                        styles.circle,
                        { backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})` },
                    )}
                >
                    <div style={styles.text}>
                        1
                    </div>
                </div>
            </div>
        </div>
    )
};
