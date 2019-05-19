import React from 'react';
import { create } from 'react-test-renderer';
import { Beatmap } from '../../../types/Beatmap';
import { Color } from '../../../types/Color';
import { ComboColors } from '../../beatmap-data/ComboColors';
import { MiscStats, MiscStatsProps } from '../../beatmap-data/MiscStats';

interface MockedBeatmapProperties {
    beatDivisor?: number;
    sliderMultiplier?: number;
    sliderTickRate?: number;
    colors?: Color[];
}

function mockBeatmap(props: MockedBeatmapProperties): Beatmap {
    return {
        beatDivisor: props.beatDivisor || 0,
        sliderMultiplier: props.sliderMultiplier || 0,
        sliderTickRate: props.sliderTickRate || 0,
        colors: props.colors || [],
    } as Beatmap;
}

const render = (props: MiscStatsProps) => {
    const component = create(<MiscStats {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('MiscStats component', () => {
    it('should display the beatmap\'s beat divisor', () => {
        // given
        const props: MiscStatsProps = {
            beatmap: mockBeatmap({ beatDivisor: 4 }),
        };

        // when
        const testInstance = render(props);
        const getBeatDivisor = () => testInstance.findByProps({ label: 'Beat Divisor' });

        // then
        expect(getBeatDivisor).not.toThrow();
        expect(getBeatDivisor().props.children).toBe(4);
    });

    it('should display the beatmap\'s slider multiplier', () => {
        // given
        const props: MiscStatsProps = {
            beatmap: mockBeatmap({ sliderMultiplier: 0.8 }),
        };

        // when
        const testInstance = render(props);
        const getSliderMultiplier = () => testInstance.findByProps({ label: 'Slider Multiplier' });

        // then
        expect(getSliderMultiplier).not.toThrow();
        expect(getSliderMultiplier().props.children).toBe(0.8);
    });

    it('should display the beatmap\'s slider tick rate', () => {
        // given
        const props: MiscStatsProps = {
            beatmap: mockBeatmap({ sliderTickRate: 1 }),
        };

        // when
        const testInstance = render(props);
        const getSliderTickRate = () => testInstance.findByProps({ label: 'Slider Tick Rate' });

        // then
        expect(getSliderTickRate).not.toThrow();
        expect(getSliderTickRate().props.children).toBe(1);
    });

    it('should display the beatmap\'s combo colors, if any', () => {
        // given
        const props: MiscStatsProps = {
            beatmap: mockBeatmap({
                colors: [
                    { red: 255, green: 128, blue: 64, alpha: 1 },
                    { red: 128, green: 64, blue: 255, alpha: 0.5 },
                ],
            }),
        };

        // when
        const testInstance = render(props);
        const getComboColors = () => testInstance.findByType(ComboColors);

        // then
        expect(getComboColors).not.toThrow();
        expect(getComboColors().props.beatmap).toBe(props.beatmap);
    });

    it('should not attempt to display the beatmap\'s combo colors if there aren\'t any', () => {
        // given
        const props: MiscStatsProps = {
            beatmap: mockBeatmap({ colors: [] }),
        };

        // when
        const testInstance = render(props);
        const getComboColors = () => testInstance.findByType(ComboColors);
        const getComboColorsContainer = () => testInstance.findByProps({ label: 'Combo Colors' });

        // then
        expect(getComboColors).toThrow();
        expect(getComboColorsContainer).not.toThrow();
        expect(getComboColorsContainer().props.children).toBe('none');
    });
});
