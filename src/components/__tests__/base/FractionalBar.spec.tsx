import React from 'react';
import { create } from 'react-test-renderer';
import { PartialBar } from '../../base/PartialBar';
import { FractionalStat, FractionalStatProps } from '../../base/stats/FractionalStat';
import { Stat } from '../../base/stats/Stat';

const render = (props: FractionalStatProps) => {
    const component = create(<FractionalStat {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('FractionalBar component', () => {
    it('should display the correct label', () => {
        // given
        const props: FractionalStatProps = {
            fraction: 0,
            label: 'test label',
        };

        // when
        const testInstance = render(props);
        const getStat = () => testInstance.findByType(Stat);

        // then
        expect(getStat).not.toThrow();
        expect(getStat().props.label).toBe('test label');
    });

    it('should contain a PartialBar with the correct value', () => {
        // given
        const props: FractionalStatProps = {
            fraction: 0.6,
            label: '',
        };

        // when
        const testInstance = render(props);
        const getPartialBar = () => testInstance.findByType(PartialBar);

        // then
        expect(getPartialBar).not.toThrow();
        expect(getPartialBar().props.fraction).toBe(0.6);
    });

    it('should display its children', () => {
        // given
        const props: React.PropsWithChildren<FractionalStatProps> = {
            fraction: 0,
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
