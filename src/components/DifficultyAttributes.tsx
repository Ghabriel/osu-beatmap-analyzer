import React from 'react';
import { colors } from '../helpers/style-variables';
import { round } from '../helpers/utilities';
import { Beatmap } from '../types/Beatmap';
import { StyleMap } from '../types/StyleMap';
import { PartialBar } from './PartialBar';

export interface DifficultyAttributesProps {
    beatmap: Beatmap;
}

const styles: StyleMap = {
    difficulty: {
        border: `1px solid ${colors.primaryBorder}`,
        marginTop: '15px',
        padding: '5px',
    },

    trait: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },

    traitKey: {
        fontWeight: 'bold',
        width: '150px',
    },

    traitValue: {
        marginLeft: '10px',
    },

    traitDivisor: {
        marginBottom: '5px',
        marginTop: '5px',
    },
};

export const DifficultyAttributes: React.FunctionComponent<DifficultyAttributesProps> = ({ beatmap }) => {
    return (
        <div style={styles.difficulty}>
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

            <hr color={colors.primaryBorder} style={styles.traitDivisor} />

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
