import React from 'react';
import { create } from 'react-test-renderer';
import { Beatmap } from '../../../types/Beatmap';
import { BasicStats, BasicStatsProps } from '../../beatmap-data/BasicStats';

interface MockedBeatmapProperties {
    title?: string;
    version?: string;
    source?: string;
    artist?: string;
    creator?: string;
}

function mockBeatmap(props: MockedBeatmapProperties): Beatmap {
    return {
        title: props.title || '',
        version: props.version || '',
        source: props.source || undefined,
        artist: props.artist || '',
        creator: props.creator || '',
    } as Beatmap;
}

const render = (props: BasicStatsProps) => {
    const component = create(<BasicStats {...props} />);
    const testInstance = component.root;

    return testInstance;
};

describe('BasicStats component', () => {
    it('should display the beatmap\'s title', () => {
        // given
        const props: BasicStatsProps = {
            beatmap: mockBeatmap({ title: 'test title' }),
        };

        // when
        const testInstance = render(props);
        const getTitle = () => testInstance.findByProps({ className: 'title' });

        // then
        expect(getTitle).not.toThrow();
        expect(getTitle().props.children).toBe('test title');
    });

    it('should display the beatmap\'s version', () => {
        // given
        const props: BasicStatsProps = {
            beatmap: mockBeatmap({ version: 'test version' }),
        };

        // when
        const testInstance = render(props);
        const getVersion = () => testInstance.findByProps({ className: 'version' });

        // then
        expect(getVersion).not.toThrow();
        expect(getVersion().props.children).toBe('test version');
    });

    it('should hide the beatmap\'s artist when it doesn\t have one', () => {
        // given
        const props: BasicStatsProps = {
            beatmap: mockBeatmap({
                source: 'test source',
                creator: 'test creator'
            }),
        };

        // when
        const testInstance = render(props);
        const getAuthor = () => testInstance.findByProps({ className: 'author' });

        // then
        expect(getAuthor).not.toThrow();
        expect(getAuthor().props.children.join('')).toBe('test source - Mapped by test creator');
    });

    it('should display the beatmap\'s artist when it has one', () => {
        // given
        const props: BasicStatsProps = {
            beatmap: mockBeatmap({
                source: 'test source',
                artist: 'test artist',
                creator: 'test creator'
            }),
        };

        // when
        const testInstance = render(props);
        const getAuthor = () => testInstance.findByProps({ className: 'author' });

        // then
        expect(getAuthor).not.toThrow();
        const expectedString = 'test source (test artist) - Mapped by test creator';
        expect(getAuthor().props.children.join('')).toBe(expectedString);
    });
});
