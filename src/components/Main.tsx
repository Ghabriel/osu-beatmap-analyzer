import React from 'react';
import { coalesce } from '../helpers/utilities';
import { Beatmap } from '../types/Beatmap';
import { StyleMap } from '../types/StyleMap';
import { DifficultyAttributes } from './DifficultyAttributes';

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
};

export const Main: React.FunctionComponent<MainProps> = ({ beatmap }) => {
    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    const source = coalesce(beatmap.source, <i>unknown source</i>);
    const artist = coalesce(beatmap.artist, <i>unknown artist</i>);

    return (
        <div>
            <div style={styles.title}>
                {beatmap.title}
            </div>

            <div style={styles.version}>
                {beatmap.version}
            </div>

            <div style={styles.author}>
                {source} ({artist}) - Mapped by {beatmap.creator}
            </div>

            <DifficultyAttributes beatmap={beatmap} />

            {/* <HitObjectTable beatmap={beatmap} /> */}

            {/* <DifficultyHitObjectTable beatmap={beatmap} /> */}
        </div>
    );
};
