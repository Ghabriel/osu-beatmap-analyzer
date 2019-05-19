import React from 'react';
import { create } from 'react-test-renderer';
import { Mod as ModType } from '../../../types/Mod';
import { Mod } from '../../beatmap-data/Mod';
import { ModSelector, ModSelectorProps } from '../../beatmap-data/ModSelector';

const render = (props: ModSelectorProps) => {
    const component = create(<ModSelector {...props} />);
    const testInstance = component.root;
    const mods = testInstance.findAllByType(Mod);

    return mods;
};

describe('ModSelector component', () => {
    it('displays EZ/HT/HR/DT mods', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const mods = render(props);

        // then
        expect(mods.length).toBe(4);
        expect(mods[0].props.children).toBe('EZ');
        expect(mods[1].props.children).toBe('HT');
        expect(mods[2].props.children).toBe('HR');
        expect(mods[3].props.children).toBe('DT');
    });

    it('differentiate EZ/HT from HR/DT in color', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const [modEZ, modHT, modHR, modDT] = render(props);

        // then
        expect(modEZ.props.color).toBe(modHT.props.color);
        expect(modHR.props.color).toBe(modDT.props.color);
        expect(modEZ.props.color).not.toBe(modHR.props.color);
    });

    it('passes the input function to EZ', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const mods = render(props);
        const modEZ = mods[0];
        modEZ.props.onClick();

        // then
        expect(props.onModClick).toBeCalledWith(ModType.Easy);
    });

    it('passes the input function to HT', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const mods = render(props);
        const modHT = mods[1];
        modHT.props.onClick();

        // then
        expect(props.onModClick).toBeCalledWith(ModType.HalfTime);
    });

    it('passes the input function to HR', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const mods = render(props);
        const modHR = mods[2];
        modHR.props.onClick();

        // then
        expect(props.onModClick).toBeCalledWith(ModType.HardRock);
    });

    it('passes the input function to DT', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set(),
            onModClick: jest.fn(),
        };

        // when
        const mods = render(props);
        const modDT = mods[3];
        modDT.props.onClick();

        // then
        expect(props.onModClick).toBeCalledWith(ModType.DoubleTime);
    });

    it('passes the "selected" prop to selected mods', () => {
        // given
        const props: ModSelectorProps = {
            selectedMods: new Set([ModType.HalfTime]),
            onModClick: jest.fn(),
        };

        // when
        const [modEZ, modHT, modHR, modDT] = render(props);

        // then
        expect(modEZ.props.selected).toBe(false);
        expect(modHT.props.selected).toBe(true);
        expect(modHR.props.selected).toBe(false);
        expect(modDT.props.selected).toBe(false);
    });
});
