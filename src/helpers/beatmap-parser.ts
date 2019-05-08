import { Beatmap, CircleMetadata, HitObjectFlags, HitObjectMetadata, ParsedBeatmap, PathType, Point, SliderMetadata, SpinnerMetadata } from '../types';
import { fillBeatmapComputedAttributes } from './beatmap-difficulty';
import { SliderPath } from './SliderPath';

enum BeatmapSection {
    General = 'General',
    Editor = 'Editor',
    Metadata = 'Metadata',
    Difficulty = 'Difficulty',
    Events = 'Events',
    TimingPoints = 'TimingPoints',
    Colors = 'Colours',
    HitObjects = 'HitObjects',
}

export function parseBeatmap(content: string): Beatmap {
    const lines = content
        .split('\n')
        .filter(line => line.trim().length > 0);

    const beatmap: Partial<Beatmap> = {};
    let currentSection: BeatmapSection | null = null;

    for (const line of lines) {
        const sectionSearch = line.match(/^\[([A-Za-z0-9]+)\]/);

        if (sectionSearch !== null) {
            currentSection = sectionSearch[1] as BeatmapSection;
            continue;
        }

        if (currentSection === null) {
            console.log('Found a line without a section. Ignoring.', line);
            continue;
        }

        parseBeatmapLine(beatmap, currentSection, line);
    }

    return fillBeatmapComputedAttributes(beatmap as ParsedBeatmap);
}

function parseBeatmapLine(beatmap: Partial<Beatmap>, section: BeatmapSection, line: string) {
    switch (section) {
        case BeatmapSection.General:
            parseGeneralLine(beatmap, line);
            break;
        case BeatmapSection.Editor:
            parseEditorLine(beatmap, line);
            break;
        case BeatmapSection.Metadata:
            parseMetadataLine(beatmap, line);
            break;
        case BeatmapSection.Difficulty:
            parseDifficultyLine(beatmap, line);
            break;
        case BeatmapSection.Events:
            parseEventLine(beatmap, line);
            break;
        case BeatmapSection.TimingPoints:
            parseTimingPointLine(beatmap, line);
            break;
        case BeatmapSection.Colors:
            parseColorLine(beatmap, line);
            break;
        case BeatmapSection.HitObjects:
            parseHitObjectLine(beatmap, line);
            break;
        default:
    }
}

function parseGeneralLine(beatmap: Partial<Beatmap>, line: string) {
    const [key, value] = line.split(':').map(p => p.trim());

    switch (key) {
        case 'AudioFilename':
            beatmap.audioFilename = value;
            break;
        case 'AudioLeadIn':
            beatmap.audioLeadIn = parseInt(value);
            break;
        case 'PreviewTime':
            beatmap.previewTime = parseInt(value);
            break;
        case 'Countdown':
            beatmap.countdown = parseInt(value);
            break;
        case 'StackLeniency':
            beatmap.stackLeniency = parseInt(value);
            break;
        case 'Mode':
            beatmap.mode = parseInt(value);
            break;
        default:
    }
}

function parseEditorLine(beatmap: Partial<Beatmap>, line: string) {
    const [key, value] = line.split(':').map(p => p.trim());

    switch (key) {
        case 'DistanceSpacing':
            beatmap.distanceSpacing = parseInt(value);
            break;
        case 'BeatDivisor':
            beatmap.beatDivisor = parseInt(value);
            break;
        case 'GridSize':
            beatmap.gridSize = parseInt(value);
            break;
        default:
    }
}

function parseMetadataLine(beatmap: Partial<Beatmap>, line: string) {
    const [key, value] = line.split(':').map(p => p.trim());

    switch (key) {
        case 'Title':
            beatmap.title = value;
            break;
        case 'TitleUnicode':
            beatmap.titleUnicode = value;
            break;
        case 'Artist':
            beatmap.artist = value;
            break;
        case 'ArtistUnicode':
            beatmap.artistUnicode = value;
            break;
        case 'Creator':
            beatmap.creator = value;
            break;
        case 'Version':
            beatmap.version = value;
            break;
        case 'Source':
            beatmap.source = value;
            break;
        case 'Tags':
            beatmap.tags = value.split(' ');
            break;
        case 'BeatmapID':
            beatmap.beatmapId = parseInt(value);
            break;
        case 'BeatmapSetID':
            beatmap.beatmapSetId = parseInt(value);
            break;
        default:
    }
}

function parseDifficultyLine(beatmap: Partial<Beatmap>, line: string) {
    const [key, value] = line.split(':').map(p => p.trim());

    switch (key) {
        case 'HPDrainRate':
            beatmap.hpDrainRate = parseInt(value);
            break;
        case 'CircleSize':
            beatmap.circleSize = parseInt(value);
            break;
        case 'OverallDifficulty':
            beatmap.overallDifficulty = parseInt(value);
            break;
        case 'ApproachRate':
            beatmap.approachRate = parseInt(value);
            break;
        case 'SliderMultiplier':
            beatmap.sliderMultiplier = parseInt(value);
            break;
        case 'SliderTickRate':
            beatmap.sliderTickRate = parseInt(value);
            break;
        default:
    }
}

function parseEventLine(beatmap: Partial<Beatmap>, line: string) {
    // TODO
}

function parseTimingPointLine(beatmap: Partial<Beatmap>, line: string) {
    // TODO
}

function parseColorLine(beatmap: Partial<Beatmap>, line: string) {
    // eslint-disable-next-line
    const [_, value] = line.split(':').map(p => p.trim());

    if (beatmap.colors === undefined) {
        beatmap.colors = [];
    }

    const colorComponents = value.split(',').map(p => parseInt(p));
    beatmap.colors.push({
        red: colorComponents[0],
        green: colorComponents[1],
        blue: colorComponents[2],
        alpha: colorComponents.length > 3 ? colorComponents[3] : 255,
    });
}

function parseHitObjectLine(beatmap: Partial<Beatmap>, line: string) {
    const parts = line.split(',');

    if (beatmap.hitObjects === undefined) {
        beatmap.hitObjects = [];
    }

    const flags = parseInt(parts[3]);
    const metadata = parseHitObjectMetadata(parts.slice(5), flags);

    if (metadata === null) {
        console.log('Invalid hit object. Ignoring.', line);
        return;
    }

    beatmap.hitObjects.push({
        x: parseInt(parts[0]),
        y: parseInt(parts[1]),
        startTime: parseInt(parts[2]),
        flags: flags,
        soundType: parseInt(parts[4]),
        metadata: metadata,
    });
}

function parseHitObjectMetadata(metadata: string[], flags: HitObjectFlags): HitObjectMetadata | null {
    if (flags & HitObjectFlags.Circle) {
        return parseCircleMetadata(metadata);
    }

    if (flags & HitObjectFlags.Slider) {
        return parseSliderMetadata(metadata);
    }

    if (flags & HitObjectFlags.Spinner) {
        return parseSpinnerMetadata(metadata);
    }

    return null;
}

function parseCircleMetadata(metadata: string[]): CircleMetadata {
    return {
        soundSamples: metadata
    };
}

function parseSliderMetadata(metadata: string[]): SliderMetadata {
    const [pathType, ...points] = metadata[0].split('|');
    const pathLength = metadata.length <= 2 ? 0 : parseInt(metadata[2]);

    const controlPoints = points.map(pair => {
        const [x, y] = pair.split(':').map(v => parseInt(v));
        return { x, y } as Point;
    });

    return {
        path: new SliderPath(
            pathType as PathType,
            controlPoints,
            pathLength,
        ),
        repeatCount: Math.max(0, parseInt(metadata[1]) - 1),
        soundSamples: metadata.slice(3),
    };
}

function parseSpinnerMetadata(metadata: string[]): SpinnerMetadata {
    return {
        endTime: parseInt(metadata[0]),
        soundSamples: metadata.slice(1),
    };
}
