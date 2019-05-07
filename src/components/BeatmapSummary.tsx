import React, { useState } from 'react';
import { merge } from '../helpers/merge';
import { Beatmap, StyleMap } from '../types';

export interface BeatmapSummaryProps {
    beatmap: Beatmap;
    isSelected: boolean;
    onClick: () => void;
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

    beatmapSummarySelected: {
        backgroundColor: '#15a8e7',
        border: '1px solid #1186b8',
    },

    beatmapSummaryHoveredSelected: {
        backgroundColor: '#1397cf',
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

export const BeatmapSummary: React.FunctionComponent<BeatmapSummaryProps> = props => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="beatmap-summary"
            style={merge(
                styles.beatmapSummary,
                hovered && styles.beatmapSummaryHovered,
                props.isSelected && styles.beatmapSummarySelected,
                props.isSelected && hovered && styles.beatmapSummaryHoveredSelected,
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={props.onClick}
        >
            {/* {beatmap.source} ({beatmap.artist}) - {beatmap.title} [{beatmap.version}] */}
            <div className="title" style={styles.title}>
                {props.beatmap.title}
            </div>

            <div className="author" style={styles.author}>
                {props.beatmap.artist} // {props.beatmap.creator}
            </div>

            <div className="version" style={styles.version}>
                {props.beatmap.version}
            </div>
        </div>
    );
};
