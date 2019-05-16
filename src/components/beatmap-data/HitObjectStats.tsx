import React from 'react';
import { isCircle, isSlider, isSpinner } from '../../helpers/type-inference';
import { getListMode, round } from '../../helpers/utilities';
import { Beatmap } from '../../types/Beatmap';
import { Stat } from '../base/stats/Stat';
import { StatDivider } from '../base/stats/StatDivider';
import { StatGroup } from '../base/stats/StatGroup';

export interface HitObjectStatsProps {
    beatmap: Beatmap;
}

export const HitObjectStats: React.FC<HitObjectStatsProps> = ({ beatmap }) => {
    const hitObjects = beatmap.hitObjects;
    const sliders = hitObjects.filter(isSlider);
    const sliderVelocities = sliders.map(s => s.metadata.velocity).sort();
    const minVelocity = sliderVelocities[0];
    const maxVelocity = sliderVelocities[sliderVelocities.length - 1];
    const modeVelocity = getListMode(sliderVelocities);

    return (
        <StatGroup>
            <Stat label='Max Combo'>
                {beatmap.difficultyAttributes.maxCombo}
            </Stat>

            <Stat label='Number of Objects'>
                {hitObjects.length}
            </Stat>

            <Stat label='Circle Count'>
                {hitObjects.filter(isCircle).length}
            </Stat>

            <Stat label='Slider Count'>
                {hitObjects.filter(isSlider).length}
            </Stat>

            <Stat label='Spinner Count'>
                {hitObjects.filter(isSpinner).length}
            </Stat>

            <StatDivider />

            <Stat label='Slider Velocity'>
                {(maxVelocity - minVelocity < 1e-3)
                    ? round(minVelocity, 3)
                    : `${round(minVelocity, 3)} - ${round(maxVelocity, 3)} (${round(modeVelocity, 3)})`}
            </Stat>
        </StatGroup>
    );
};
