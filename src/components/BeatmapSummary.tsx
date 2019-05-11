import React, { useState } from 'react';
import { merge } from '../helpers/merge';
import { colors } from '../helpers/style-variables';
import { StyleMap } from '../types';
import { Beatmap } from '../types/Beatmap';

export interface BeatmapSummaryProps {
    beatmap: Beatmap;
    isSelected: boolean;
    onClick: () => void;
}

const styles: StyleMap = {
    beatmapSummary: {
        backgroundColor: colors.secondary,
        border: `1px solid ${colors.secondaryBorder}`,
        borderRadius: '2px',
        cursor: 'pointer',
        marginTop: '3px',
        padding: '3px',
    },

    beatmapSummaryHovered: {
        backgroundColor: colors.secondaryDark,
    },

    beatmapSummarySelected: {
        backgroundColor: colors.primary,
        border: `1px solid ${colors.primaryBorder}`,
    },

    beatmapSummaryHoveredSelected: {
        backgroundColor: colors.primaryDark,
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
