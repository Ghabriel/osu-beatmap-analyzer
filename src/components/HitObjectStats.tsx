import React from 'react';
import { isCircle, isSlider, isSpinner } from '../helpers/type-inference';
import { getListMode, round } from '../helpers/utilities';
import { propertyTableStyles } from '../styles/property-table';
import { Beatmap } from '../types/Beatmap';
import { BasicStat } from './BasicStat';

export interface HitObjectStatsProps {
    beatmap: Beatmap;
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

export const HitObjectStats: React.FunctionComponent<HitObjectStatsProps> = ({ beatmap }) => {
    const hitObjects = beatmap.hitObjects;
    const sliders = hitObjects.filter(isSlider);
    const sliderVelocities = sliders.map(s => s.metadata.velocity).sort();
    const minVelocity = sliderVelocities[0];
    const maxVelocity = sliderVelocities[sliderVelocities.length - 1];
    const modeVelocity = getListMode(sliderVelocities);

    return (
        <div style={propertyTableStyles.frame}>
            {/* {trait('Duration', beatmap.beatDivisor)} */}
            <BasicStat label='Max Combo' value={getMaxCombo(beatmap)} />
            <BasicStat label='Number of Objects' value={hitObjects.length} />
            <BasicStat label='Circle Count' value={hitObjects.filter(isCircle).length} />
            <BasicStat label='Slider Count' value={hitObjects.filter(isSlider).length} />
            <BasicStat label='Spinner Count' value={hitObjects.filter(isSpinner).length} />

            <hr style={propertyTableStyles.traitDivisor} />

            <BasicStat
                label='Slider Velocity'
                value={(maxVelocity - minVelocity < 1e-3)
                    ? `${round(minVelocity, 3)}`
                    : `${round(minVelocity, 3)} - ${round(maxVelocity, 3)} (${round(modeVelocity, 3)})`}
            />
        </div>
    );
};
