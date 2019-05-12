import React from 'react';
import { Beatmap } from '../types/Beatmap';
import { StyleMap } from '../types/StyleMap';
import { DifficultyAttributes } from './DifficultyAttributes';
import { HitObjectStats } from './HitObjectStats';
import { MiscStats } from './MiscStats';

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

    const artist = beatmap.artist;

    return (
        <div>
            <div style={styles.title}>
                {beatmap.title}
            </div>

            <div style={styles.version}>
                {beatmap.version}
            </div>

            <div style={styles.author}>
                {beatmap.source} {artist ? `(${artist})` : ''} - Mapped by {beatmap.creator}
            </div>

            <DifficultyAttributes beatmap={beatmap} />

            {/* <HitObjectTable beatmap={beatmap} /> */}

            {/* <DifficultyHitObjectTable beatmap={beatmap} /> */}

            <HitObjectStats beatmap={beatmap} />

            <MiscStats beatmap={beatmap} />
        </div>
    );
};
