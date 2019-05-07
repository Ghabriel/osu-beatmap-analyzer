import React from 'react';
import { colors } from '../helpers/style-variables';
import { Beatmap, StyleMap } from '../types';

export interface MainProps {
    beatmap: Beatmap | null;
}

const styles: StyleMap = {
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },

    version: {
        fontWeight: 'bold',
    },

    author: {
        fontSize: '1.1rem',
    },

    difficulty: {
        border: `1px solid ${colors.primaryBorder}`,
        marginTop: '15px',
        padding: '5px',
    },

    trait: {
        display: 'flex',
        flexDirection: 'row',
    },

    traitKey: {
        fontWeight: 'bold',
        width: '150px',
    },
};

export const Main: React.FunctionComponent<MainProps> = ({ beatmap }) => {
    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    return (
        <div>
            <div style={styles.title}>
                {beatmap.title}
            </div>

            <div style={styles.version}>
                {beatmap.version}
            </div>

            <div style={styles.author}>
                {beatmap.source} ({beatmap.artist}) - Mapped by {beatmap.creator}
            </div>

            <div style={styles.difficulty}>
                <div style={styles.trait}>
                    <div style={styles.traitKey}>HP Drain</div>
                    <div>{beatmap.hpDrainRate}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Circle Size</div>
                    <div>{beatmap.circleSize}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Overall Difficulty</div>
                    <div>{beatmap.overallDifficulty}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Approach Rate</div>
                    <div>{beatmap.approachRate}</div>
                </div>
            </div>
        </div>
    );
};
