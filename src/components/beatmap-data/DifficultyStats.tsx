import React from 'react';
import { round } from '../../helpers/utilities';
import { Beatmap } from '../../types/Beatmap';
import { FractionalStat } from '../base/stats/FractionalStat';
import { StatDivider } from '../base/stats/StatDivider';

export interface DifficultyStatsProps {
    beatmap: Beatmap;
}

interface StatProps {
    label: string;
    precision: number;
    value: number;
}

const DiffStat: React.FC<StatProps> = ({ label, value, precision, children }) => (
    <FractionalStat label={label} fraction={value / 10}>
        <span className="value">
            {round(value, precision)}
        </span>

        {children}
    </FractionalStat>
);

export const DifficultyStats: React.FC<DifficultyStatsProps> = ({ beatmap }) => {
    const baseDifficulty = beatmap.baseDifficulty;
    const derivedAttributes = beatmap.derivedDifficulty;
    const od = derivedAttributes.overallDifficulty;
    const ar = derivedAttributes.approachRate;

    return (
        <div className="stat-group">
            <DiffStat label='HP Drain' precision={2} value={baseDifficulty.hpDrainRate} />
            <DiffStat label='Circle Size' precision={2} value={baseDifficulty.circleSize} />

            <DiffStat
                label='Overall Difficulty'
                precision={2}
                value={od.value}
            >
                <span className="tolerance">
                    ({round(od.toleranceMS, 1)} ms)
                </span>
            </DiffStat>

            <DiffStat
                label='Approach Rate'
                precision={2}
                value={ar.value}
            >
                <span className="tolerance">
                    ({round(ar.toleranceMS, 1)} ms)
                </span>
            </DiffStat>

            <StatDivider />

            <DiffStat label='Aim Strain' precision={3} value={derivedAttributes.aimStrain} />
            <DiffStat label='Speed Strain' precision={3} value={derivedAttributes.speedStrain} />
            <DiffStat label='Star Rating' precision={3} value={derivedAttributes.starRating} />
        </div>
    );
};
