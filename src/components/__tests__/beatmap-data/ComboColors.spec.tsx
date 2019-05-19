import React from 'react';
import { create } from 'react-test-renderer';
import { Beatmap } from '../../../types/Beatmap';
import { Color } from '../../../types/Color';
import { ComboColors, ComboColorsProps } from '../../beatmap-data/ComboColors';
import { HitObject } from '../../beatmap-data/HitObject';

const render = (props: ComboColorsProps) => {
    const component = create(<ComboColors {...props} />);
    const testInstance = component.root;
    const hitObjects = testInstance.findAllByType(HitObject);

    return hitObjects;
}

describe('ComboColors component', () => {
    it('displays a HitObject for each combo color', () => {
        // given
        const testColor1 = { red: 64, green: 128, blue: 255, alpha: 1 };
        const testColor2 = { red: 128, green: 255, blue: 64, alpha: 0.5 };
        const props: ComboColorsProps = {
            beatmap: { colors: [testColor1, testColor2] } as Beatmap,
        };

        // when
        const hitObjects = render(props);

        // then
        expect(hitObjects.length).toBe(2);
        expect(hitObjects[0].props.backgroundColor).toBe(testColor1);
        expect(hitObjects[1].props.backgroundColor).toBe(testColor2);
    });

    it('displays nothing when the beatmap has no combo colors', () => {
        // given
        const props: ComboColorsProps = {
            beatmap: { colors: [] as Color[] } as Beatmap,
        };

        // when
        const hitObjects = render(props);

        // then
        expect(hitObjects.length).toBe(0);
    });
});
