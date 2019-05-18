import React from 'react';
import { create } from 'react-test-renderer';
import { Stat, StatProps } from '../base/stats/Stat';

const render = (props: StatProps) => {
    const component = create(<Stat {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('Stat component', () => {
    it('should display the correct label', () => {
        // given
        const props: StatProps = {
            label: 'test label',
        };

        // when
        const testInstance = render(props);
        const getLabelContainer = () => testInstance.findByProps({ id: 'label-container' });

        // then
        expect(getLabelContainer).not.toThrow();
        expect(getLabelContainer().children).toStrictEqual(['test label']);
    });

    it('should display its children', () => {
        // given
        const props: React.PropsWithChildren<StatProps> = {
            label: '',
            children: <span id='test-node'></span>
        };

        // when
        const testInstance = render(props);
        const getTestNode = () => testInstance.findByProps({ id: 'test-node' });

        // then
        expect(getTestNode).not.toThrow();
    });
});
