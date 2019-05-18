import React from 'react';
import { create, ReactTestInstance } from 'react-test-renderer';
import { PartialBar, PartialBarProps } from '../../base/PartialBar';

const render = (props: PartialBarProps) => {
    const component = create(<PartialBar {...props} />);
    const testInstance = component.root;
    const wrapper = testInstance.findByType('div');
    const [filledContainer, emptyContainer] = wrapper.children as ReactTestInstance[];

    return { filledContainer, emptyContainer };
};

describe('PartialBar component', () => {
    it('should have the correct width', () => {
        // given
        const props: PartialBarProps = {
            fraction: 0.3,
        };

        // when
        const { filledContainer, emptyContainer } = render(props);

        // then
        expect(filledContainer.props.style.flexBasis).toBe('30%');
        expect(emptyContainer.props.style.flexBasis).toBe('70%');
    });

    it('should not go below 0%', () => {
        // given
        const props: PartialBarProps = {
            fraction: -0.1,
        };

        // when
        const { filledContainer, emptyContainer } = render(props);

        // then
        expect(filledContainer.props.style.flexBasis).toBe('0%');
        expect(emptyContainer.props.style.flexBasis).toBe('100%');
    });

    it('should not go above 100%', () => {
        // given
        const props: PartialBarProps = {
            fraction: 1.1,
        };

        // when
        const { filledContainer, emptyContainer } = render(props);

        // then
        expect(filledContainer.props.style.flexBasis).toBe('100%');
        expect(emptyContainer.props.style.flexBasis).toBe('0%');
    });
});

