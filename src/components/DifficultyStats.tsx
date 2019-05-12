import React from 'react';
import { round } from '../helpers/utilities';
import { propertyTableStyles as styles } from '../styles/property-table';
import { Beatmap } from '../types/Beatmap';
import { FractionalStat } from './FractionalStat';
import { StatDivider } from './StatDivider';

export interface DifficultyStatsProps {
    beatmap: Beatmap;
}

interface StatProps {
    label: string;
    value: number;
}

export const DifficultyStats: React.FC<DifficultyStatsProps> = ({ beatmap }) => {
    const IntStat: React.FC<StatProps> = ({ label, value }) => (
        <FractionalStat label={label} value={value} fraction={value / 10} />
    );

    const FloatStat: React.FC<StatProps> = ({ label, value }) => (
        <FractionalStat label={label} value={round(value, 3)} fraction={value / 10} />
    );

    return (
        <div style={styles.frame}>
            <IntStat label='HP Drain' value={beatmap.hpDrainRate} />
            <IntStat label='Circle Size' value={beatmap.circleSize} />
            <IntStat label='Overall Difficulty' value={beatmap.overallDifficulty} />
            <IntStat label='Approach Rate' value={beatmap.approachRate} />

            <StatDivider />

            <FloatStat label='Aim Strain' value={beatmap.aimStrain} />
            <FloatStat label='Speed Strain' value={beatmap.speedStrain} />
            <FloatStat label='Star Rating' value={beatmap.starRating} />
        </div>
    );
};
