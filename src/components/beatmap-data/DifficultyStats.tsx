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

    const baseDifficulty = beatmap.baseDifficulty;
    const derivedAttributes = beatmap.derivedDifficulty;

    return (
        <StatGroup>
            <IntStat label='HP Drain' value={baseDifficulty.hpDrainRate} />
            <IntStat label='Circle Size' value={baseDifficulty.circleSize} />
            <IntStat label='Overall Difficulty' value={baseDifficulty.overallDifficulty} />
            <IntStat label='Approach Rate' value={baseDifficulty.approachRate} />

            <StatDivider />

            <FloatStat label='Aim Strain' value={derivedAttributes.aimStrain} />
            <FloatStat label='Speed Strain' value={derivedAttributes.speedStrain} />
            <FloatStat label='Star Rating' value={derivedAttributes.starRating} />
        </StatGroup>
    );
};
