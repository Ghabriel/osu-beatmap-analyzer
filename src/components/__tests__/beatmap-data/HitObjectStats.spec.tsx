import React from 'react';
import { create } from 'react-test-renderer';
import { bigBlack as bigBlackString } from '../../../beatmap-mocks/big-black.beatmap';
import { quaver as quaverString } from '../../../beatmap-mocks/quaver.beatmap';
import { readBeatmapFromString } from '../../../helpers/beatmap';
import { HitObjectStats, HitObjectStatsProps } from '../../beatmap-data/HitObjectStats';

const render = (props: HitObjectStatsProps) => {
    const component = create(<HitObjectStats {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('HitObjectStats component', () => {
    const quaver = readBeatmapFromString(quaverString);
    const bigBlack = readBeatmapFromString(bigBlackString);

    it('should display the beatmap\'s max combo', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getMaxCombo = () => testInstance.findByProps({ label: 'Max Combo' });

        // then
        expect(getMaxCombo).not.toThrow();
        expect(getMaxCombo().props.children).toBe(145);
    });

    it('should display the beatmap\'s number of objects', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getNumberOfObjects = () => testInstance.findByProps({ label: 'Number of Objects' });

        // then
        expect(getNumberOfObjects).not.toThrow();
        expect(getNumberOfObjects().props.children).toBe(63);
    });

    it('should display the beatmap\'s circle count', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getCircleCount = () => testInstance.findByProps({ label: 'Circle Count' });

        // then
        expect(getCircleCount).not.toThrow();
        expect(getCircleCount().props.children).toBe(19);
    });

    it('should display the beatmap\'s slider count', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getSliderCount = () => testInstance.findByProps({ label: 'Slider Count' });

        // then
        expect(getSliderCount).not.toThrow();
        expect(getSliderCount().props.children).toBe(41);
    });

    it('should display the beatmap\'s spinner count', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getSpinnerCount = () => testInstance.findByProps({ label: 'Spinner Count' });

        // then
        expect(getSpinnerCount).not.toThrow();
        expect(getSpinnerCount().props.children).toBe(3);
    });

    it('should display the beatmap\'s slider velocity as a single value, if constant', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: bigBlack,
        };

        // when
        const testInstance = render(props);
        const getSliderVelocity = () => testInstance.findByProps({ label: 'Slider Velocity' });

        // then
        expect(getSliderVelocity).not.toThrow();
        expect(getSliderVelocity().props.children).toBe('1.081');
    });

    it('should display the beatmap\'s slider velocity as "min - max (mode)", if variable', () => {
        // given
        const props: HitObjectStatsProps = {
            beatmap: quaver,
        };

        // when
        const testInstance = render(props);
        const getSliderVelocity = () => testInstance.findByProps({ label: 'Slider Velocity' });

        // then
        expect(getSliderVelocity).not.toThrow();
        expect(getSliderVelocity().props.children).toBe('0.243 - 0.298 (0.273)');
    });
});
