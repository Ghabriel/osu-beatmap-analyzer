import React from 'react';
import { create } from 'react-test-renderer';
import { Mod, ModProps } from '../../beatmap-data/Mod';

const render = (props: ModProps) => {
    const component = create(<Mod {...props} />);
    const testInstance = component.root;
    const container = testInstance.findByType('div');

    return { container };
};

describe('Mod component', () => {
    it('has the correct color', () => {
        // given
        const props: ModProps = {
            color: 'rgb(64, 128, 255)',
            onClick: jest.fn(),
        };

        // when
        const { container } = render(props);

        // then
        expect(container.props.style.backgroundColor).toBe(props.color);
    });

    it('has bold font when selected', () => {
        // given
        const props: ModProps = {
            selected: true,
            onClick: jest.fn(),
        };

        // when
        const { container } = render(props);

        // then
        expect(container.props.style.fontWeight).toBe('bold');
    });

    it('has normal font when not selected', () => {
        // given
        const props: ModProps = {
            onClick: jest.fn(),
        };

        // when
        const { container } = render(props);

        // then
        expect(container.props.style.fontWeight).not.toBe('bold');
    });

    it('calls the input function when clicked', () => {
        // given
        const props: ModProps = {
            onClick: jest.fn(),
        };

        // when
        const { container } = render(props);
        container.props.onClick();

        // then
        expect(props.onClick).toBeCalled();
    });

    it('displays its children', () => {
        // given
        const props: React.PropsWithChildren<ModProps> = {
            onClick: jest.fn(),
            children: <span id='test-node'></span>,
        };

        // when
        const { container } = render(props);
        const getTestNode = () => container.findByProps({ id: 'test-node' });

        // then
        expect(getTestNode).not.toThrow();
    });
});
