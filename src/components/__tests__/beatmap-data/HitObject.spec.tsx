import React from 'react';
import { create } from 'react-test-renderer';
import { HitObject, HitObjectProps } from '../../beatmap-data/HitObject';

const render = (props: HitObjectProps) => {
    const component = create(<HitObject {...props} />);
    const testInstance = component.root;
    const circle = testInstance.findByProps({ id: 'circle' });

    return { circle };
};

describe('HitObject component', () => {
    it('should use the correct color', () => {
        // given
        const props: HitObjectProps = {
            backgroundColor: {
                red: 64,
                green: 128,
                blue: 255,
                alpha: 1,
            },
        };

        // when
        const { circle } = render(props);

        // then
        expect(circle.props.style.backgroundColor).toBe('rgba(64, 128, 255, 1)');
    });
});
