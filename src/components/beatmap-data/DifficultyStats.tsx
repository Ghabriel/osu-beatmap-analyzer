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
            {value}
        </FractionalStat>
    );

    const FloatStat: React.FC<StatProps> = ({ label, value }) => (
        <FractionalStat label={label} fraction={value / 10}>
            {round(value, 3)}
        </FractionalStat>
    );

    return (
        <StatGroup>
            <IntStat label='HP Drain' value={beatmap.hpDrainRate} />
            <IntStat label='Circle Size' value={beatmap.circleSize} />
            <IntStat label='Overall Difficulty' value={beatmap.overallDifficulty} />
            <IntStat label='Approach Rate' value={beatmap.approachRate} />

            <StatDivider />

            <FloatStat label='Aim Strain' value={beatmap.aimStrain} />
            <FloatStat label='Speed Strain' value={beatmap.speedStrain} />
            <FloatStat label='Star Rating' value={beatmap.starRating} />
        </StatGroup>
    );
};