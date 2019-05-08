import React from 'react';
import { colors } from '../helpers/style-variables';
import { Beatmap, StyleMap } from '../types';
import { PartialBar } from './PartialBar';

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
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },

    traitKey: {
        fontWeight: 'bold',
        width: '150px',
    },

    traitValue: {
        marginLeft: '10px',
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
                    <PartialBar fraction={beatmap.hpDrainRate / 10} />
                    <div style={styles.traitValue}>{beatmap.hpDrainRate}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Circle Size</div>
                    <PartialBar fraction={beatmap.circleSize / 10} />
                    <div style={styles.traitValue}>{beatmap.circleSize}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Overall Difficulty</div>
                    <PartialBar fraction={beatmap.overallDifficulty / 10} />
                    <div style={styles.traitValue}>{beatmap.overallDifficulty}</div>
                </div>

                <div style={styles.trait}>
                    <div style={styles.traitKey}>Approach Rate</div>
                    <PartialBar fraction={beatmap.approachRate / 10} />
                    <div style={styles.traitValue}>{beatmap.approachRate}</div>
                </div>
            </div>
        </div>
    );
};
