import React from 'react';
import { create } from 'react-test-renderer';
import { Beatmap } from '../../../types/Beatmap';
import { DifficultyStats, DifficultyStatsProps } from '../../beatmap-data/DifficultyStats';

interface MockedBeatmapProperties {
    hpDrainRate?: number;
    circleSize?: number;
    overallDifficulty?: number;
    approachRate?: number;
    aimStrain?: number;
    speedStrain?: number;
    starRating?: number;
}

function mockBeatmap(props: MockedBeatmapProperties): Beatmap {
    return {
        baseDifficulty: {
            hpDrainRate: props.hpDrainRate || 0,
            circleSize: props.circleSize || 0,
            overallDifficulty: props.overallDifficulty || 0,
            approachRate: props.approachRate || 0,
        },
        derivedDifficulty: {
            aimStrain: props.aimStrain || 0,
            speedStrain: props.speedStrain || 0,
            starRating: props.starRating || 0,
            maxCombo: 0,
            approachRate: props.approachRate || 0,
        },
    } as Beatmap;
}

const render = (props: DifficultyStatsProps) => {
    const component = create(<DifficultyStats {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('DifficultyStats component', () => {
    it('should display the beatmap\'s HP', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ hpDrainRate: 7 }),
        };

        // when
        const testInstance = render(props);
        const getHP = () => testInstance.findByProps({ label: 'HP Drain' });

        // then
        expect(getHP).not.toThrow();
        expect(getHP().props.value).toBe(7);
    });

    it('should display the beatmap\'s CS', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ circleSize: 4 }),
        };

        // when
        const testInstance = render(props);
        const getCS = () => testInstance.findByProps({ label: 'Circle Size' });

        // then
        expect(getCS).not.toThrow();
        expect(getCS().props.value).toBe(4);
    });

    it('should display the beatmap\'s OD', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ overallDifficulty: 8 }),
        };

        // when
        const testInstance = render(props);
        const getOD = () => testInstance.findByProps({ label: 'Overall Difficulty' });

        // then
        expect(getOD).not.toThrow();
        expect(getOD().props.value).toBe(8);
    });

    it('should display the beatmap\'s AR', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ approachRate: 9.5 }),
        };

        // when
        const testInstance = render(props);
        const getAR = () => testInstance.findByProps({ label: 'Approach Rate' });

        // then
        expect(getAR).not.toThrow();
        expect(getAR().props.value).toBe(9.5);
    });

    it('should display the beatmap\'s aim strain', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ aimStrain: 0.952 }),
        };

        // when
        const testInstance = render(props);
        const getAimStrain = () => testInstance.findByProps({ label: 'Aim Strain' });

        // then
        expect(getAimStrain).not.toThrow();
        expect(getAimStrain().props.value).toBe(0.952);
    });

    it('should display the beatmap\'s speed strain', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ speedStrain: 0.781 }),
        };

        // when
        const testInstance = render(props);
        const getSpeedStrain = () => testInstance.findByProps({ label: 'Speed Strain' });

        // then
        expect(getSpeedStrain).not.toThrow();
        expect(getSpeedStrain().props.value).toBe(0.781);
    });

    it('should display the beatmap\'s star rating', () => {
        // given
        const props: DifficultyStatsProps = {
            beatmap: mockBeatmap({ starRating: 1.819 }),
        };

        // when
        const testInstance = render(props);
        const getStarRating = () => testInstance.findByProps({ label: 'Star Rating' });

        // then
        expect(getStarRating).not.toThrow();
        expect(getStarRating().props.value).toBe(1.819);
    });
});
