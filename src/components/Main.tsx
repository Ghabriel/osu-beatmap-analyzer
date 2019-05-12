import React from 'react';
import { coalesce } from '../helpers/utilities';
import { Beatmap } from '../types/Beatmap';
import { StyleMap } from '../types/StyleMap';
import { ComboColors } from './ComboColors';
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

    comboColorsLabel: {
        marginRight: '10px',
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

            <div>Beat Divisor: {beatmap.beatDivisor}</div>
            <div>Slider Multiplier: {beatmap.sliderMultiplier}</div>
            <div>Slider Tick Rate: {beatmap.sliderTickRate}</div>

            <div>
                <span style={styles.comboColorsLabel}>Combo Colors:</span>
                <ComboColors beatmap={beatmap}></ComboColors>
            </div>
        </div>
    );
};
