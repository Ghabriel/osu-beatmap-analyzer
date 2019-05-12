import React from 'react';
import { round } from '../helpers/utilities';
import { propertyTableStyles as styles } from '../styles/property-table';
import { Beatmap } from '../types/Beatmap';
import { PartialBar } from './PartialBar';

export interface DifficultyStatsProps {
    beatmap: Beatmap;
}

function trait(key: string, value: number, decimalPlaces?: number): JSX.Element {
    return (
        <div style={styles.trait}>
            <div style={styles.traitKey}>
                {key}
            </div>

            <PartialBar fraction={value / 10} />

            <div style={styles.traitValue}>
                {decimalPlaces === undefined ? value : round(value, decimalPlaces)}
            </div>
        </div>
    );
}

export const DifficultyStats: React.FunctionComponent<DifficultyStatsProps> = ({ beatmap }) => {
    return (
        <div style={styles.frame}>
            {trait('HP Drain', beatmap.hpDrainRate)}
            {trait('Circle Size', beatmap.circleSize)}
            {trait('Overall Difficulty', beatmap.overallDifficulty)}
            {trait('Approach Rate', beatmap.approachRate)}

            <hr style={styles.traitDivisor} />

            {trait('Aim Strain', beatmap.aimStrain, 3)}
            {trait('Speed Strain', beatmap.speedStrain, 3)}
            {trait('Star Rating', beatmap.starRating, 3)}
        </div>
    );
};
