import React from 'react';
import { round } from '../../helpers/utilities';
import { Beatmap } from '../../types/Beatmap';
import { FractionalStat } from '../base/stats/FractionalStat';
import { StatDivider } from '../base/stats/StatDivider';
import { StatGroup } from '../base/stats/StatGroup';

export interface DifficultyStatsProps {
    beatmap: Beatmap;
}

interface StatProps {
    label: string;
    value: number;
}

export const DifficultyStats: React.FC<DifficultyStatsProps> = ({ beatmap }) => {
    const IntStat: React.FC<StatProps> = ({ label, value }) => (
        <FractionalStat label={label} fraction={value / 10}>
            {round(value, 2)}
        </FractionalStat>
    );

    const FloatStat: React.FC<StatProps> = ({ label, value }) => (
        <FractionalStat label={label} fraction={value / 10}>
            {round(value, 3)}
        </FractionalStat>
    );

    const basicAttributes = beatmap.basicDifficultyAttributes;
    const calculatedAttributes = beatmap.calculatedDifficultyAttributes;

    return (
        <StatGroup>
            <IntStat label='HP Drain' value={basicAttributes.hpDrainRate} />
            <IntStat label='Circle Size' value={basicAttributes.circleSize} />
            <IntStat label='Overall Difficulty' value={basicAttributes.overallDifficulty} />
            <IntStat label='Approach Rate' value={basicAttributes.approachRate} />

            <StatDivider />

            <FloatStat label='Aim Strain' value={calculatedAttributes.aimStrain} />
            <FloatStat label='Speed Strain' value={calculatedAttributes.speedStrain} />
            <FloatStat label='Star Rating' value={calculatedAttributes.starRating} />
        </StatGroup>
    );
};
