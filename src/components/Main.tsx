import React from 'react';
import { coalesce } from '../helpers/utilities';
import { propertyTableStyles } from '../styles/property-table';
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
};

type JSXValue = string | number | JSX.Element;

function trait(key: JSXValue, value: JSXValue): JSX.Element {
    return (
        <div style={propertyTableStyles.trait}>
            <div style={propertyTableStyles.traitKey}>
                {key}
            </div>

            <div style={propertyTableStyles.traitValue}>
                {value}
            </div>
        </div>
    );
}

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

            <div style={propertyTableStyles.frame}>
                {trait('Beat Divisor', beatmap.beatDivisor)}
                {trait('Slider Multiplier', beatmap.sliderMultiplier)}
                {trait('Slider Tick Rate', beatmap.sliderTickRate)}
                {trait('Combo Colors', <ComboColors beatmap={beatmap} />)}
            </div>
        </div>
    );
};
