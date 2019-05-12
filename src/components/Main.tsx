import React from 'react';
import { isCircle, isSlider, isSpinner } from '../helpers/type-inference';
import { getListMode, round } from '../helpers/utilities';
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

function getMaxCombo(beatmap: Beatmap): number {
    let result = beatmap.hitObjects.length;

    for (const hitObject of beatmap.hitObjects) {
        if (isSlider(hitObject)) {
            result += hitObject.metadata.nestedHitObjects.length - 1;
        }
    }

    return result;
}

export const Main: React.FunctionComponent<MainProps> = ({ beatmap }) => {
    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    const hitObjects = beatmap.hitObjects;
    const sliders = hitObjects.filter(isSlider);
    const sliderVelocities = sliders.map(s => s.metadata.velocity).sort();
    const minVelocity = sliderVelocities[0];
    const maxVelocity = sliderVelocities[sliderVelocities.length - 1];
    const modeVelocity = getListMode(sliderVelocities);

    const source = beatmap.source || <i>unknown source</i>;
    const artist = beatmap.artist || <i>unknown artist</i>;

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
                {/* {trait('Duration', beatmap.beatDivisor)} */}
                {trait('Max Combo', getMaxCombo(beatmap))}
                {trait('Number of Objects', hitObjects.length)}
                {trait('Circle Count', hitObjects.filter(isCircle).length)}
                {trait('Slider Count', hitObjects.filter(isSlider).length)}
                {trait('Spinner Count', hitObjects.filter(isSpinner).length)}

                <hr style={propertyTableStyles.traitDivisor} />

                {trait('Slider Velocity',
                    (maxVelocity - minVelocity < 1e-3)
                    ? `${round(minVelocity, 3)}`
                    : `${round(minVelocity, 3)} - ${round(maxVelocity, 3)} (${round(modeVelocity, 3)})`
                )}
            </div>

            <div style={propertyTableStyles.frame}>
                {trait('Beat Divisor', beatmap.beatDivisor)}
                {trait('Slider Multiplier', beatmap.sliderMultiplier)}
                {trait('Slider Tick Rate', beatmap.sliderTickRate)}
                {trait('Combo Colors',
                    (beatmap.colors.length > 0)
                    ? <ComboColors beatmap={beatmap} />
                    : <i>none</i>
                )}
            </div>
        </div>
    );
};
