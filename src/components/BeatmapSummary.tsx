import React, { CSSProperties } from 'react';
import { Beatmap } from '../types';

export interface BeatmapSummaryProps {
    beatmap: Beatmap;
}

interface StyleMap {
    [key: string]: CSSProperties;
}

const styles: StyleMap = {
    beatmapSummary: {
        backgroundColor: '#b3b3b3',
        border: '1px solid #8d8d8d',
        borderRadius: '2px',
        marginTop: '3px',
        padding: '3px',
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
    return (
        <div className="beatmap-summary" style={styles.beatmapSummary}>
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
