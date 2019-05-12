import React from 'react';
import { round } from '../helpers/utilities';
import { propertyTableStyles as styles } from '../styles/property-table';
import { Beatmap } from '../types/Beatmap';
import { PartialBar } from './PartialBar';

export interface DifficultyAttributesProps {
    beatmap: Beatmap;
}

export const DifficultyAttributes: React.FunctionComponent<DifficultyAttributesProps> = ({ beatmap }) => {
    return (
        <div style={styles.frame}>
            <div style={styles.trait}>
                <div style={styles.traitKey}>HP Drain</div>
                <PartialBar fraction={beatmap.hpDrainRate / 10} />
                <div style={styles.traitValue}>{beatmap.hpDrainRate}</div>
            </div>

            <div style={styles.trait}>
                <div style={styles.traitKey}>Circle Size</div>
                <PartialBar fraction={beatmap.circleSize / 10} />
                <div style={styles.traitValue}>{beatmap.circleSize}</div>
            </div>

            <div style={styles.trait}>
                <div style={styles.traitKey}>Overall Difficulty</div>
                <PartialBar fraction={beatmap.overallDifficulty / 10} />
                <div style={styles.traitValue}>{beatmap.overallDifficulty}</div>
            </div>

            <div style={styles.trait}>
                <div style={styles.traitKey}>Approach Rate</div>
                <PartialBar fraction={beatmap.approachRate / 10} />
                <div style={styles.traitValue}>{beatmap.approachRate}</div>
            </div>

            <hr style={styles.traitDivisor} />

            <div style={styles.trait}>
                <div style={styles.traitKey}>Aim Strain</div>
                <PartialBar fraction={beatmap.aimStrain / 10} />
                <div style={styles.traitValue}>{round(beatmap.aimStrain, 3)}</div>
            </div>

            <div style={styles.trait}>
                <div style={styles.traitKey}>Speed Strain</div>
                <PartialBar fraction={beatmap.speedStrain / 10} />
                <div style={styles.traitValue}>{round(beatmap.speedStrain, 3)}</div>
            </div>

            <div style={styles.trait}>
                <div style={styles.traitKey}>Star Rating</div>
                <PartialBar fraction={beatmap.starRating / 10} />
                <div style={styles.traitValue}>{round(beatmap.starRating, 3)}</div>
            </div>
        </div>
    );
};
