import React, { useState } from 'react';
import { merge } from '../helpers/merge';
import { Beatmap, StyleMap } from '../types';

export interface BeatmapSummaryProps {
    beatmap: Beatmap;
}

const styles: StyleMap = {
    beatmapSummary: {
        backgroundColor: '#b3b3b3',
        border: '1px solid #8d8d8d',
        borderRadius: '2px',
        cursor: 'pointer',
        marginTop: '3px',
        padding: '3px',
    },

    beatmapSummaryHovered: {
        backgroundColor: '#9a9a9a',
    },

    title: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },

    author: {
        fontSize: '0.8rem',
    },

    version: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
};

export const BeatmapSummary: React.FunctionComponent<BeatmapSummaryProps> = ({ beatmap }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="beatmap-summary"
            style={merge(
                styles.beatmapSummary,
                hovered && styles.beatmapSummaryHovered,
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* {beatmap.source} ({beatmap.artist}) - {beatmap.title} [{beatmap.version}] */}
            <div className="title" style={styles.title}>
                {beatmap.title}
            </div>

            <div className="author" style={styles.author}>
                {beatmap.artist} // {beatmap.creator}
            </div>

            <div className="version" style={styles.version}>
                {beatmap.version}
            </div>
        </div>
    );
};
