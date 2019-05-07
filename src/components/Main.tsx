import React from 'react';
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
        border: '1px solid #1186b8',
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
            <div className="title" style={styles.title}>
                {beatmap.title}
            </div>

            <div className="version" style={styles.version}>
                {beatmap.version}
            </div>

            <div className="author" style={styles.author}>
                {beatmap.source} ({beatmap.artist}) - Mapped by {beatmap.creator}
            </div>

            <div className="difficulty" style={styles.difficulty}>
                <div className="trait" style={styles.trait}>
                    <div className="key" style={styles.traitKey}>HP Drain</div>
                    <div className="value">{beatmap.hpDrainRate}</div>
                </div>

                <div className="trait" style={styles.trait}>
                    <div className="key" style={styles.traitKey}>Circle Size</div>
                    <div className="value">{beatmap.circleSize}</div>
                </div>

                <div className="trait" style={styles.trait}>
                    <div className="key" style={styles.traitKey}>Overall Difficulty</div>
                    <div className="value">{beatmap.overallDifficulty}</div>
                </div>

                <div className="trait" style={styles.trait}>
                    <div className="key" style={styles.traitKey}>Approach Rate</div>
                    <div className="value">{beatmap.approachRate}</div>
                </div>
            </div>
        </div>
    );
};
