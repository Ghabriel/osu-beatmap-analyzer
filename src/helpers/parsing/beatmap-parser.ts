import { Beatmap, ParsedBeatmap } from '../../types/Beatmap';
import { EffectFlags } from '../../types/EffectFlags';
import { BaseHitObject, CircleMetadata, HitObject, HitObjectType, SliderMetadata, SpinnerMetadata } from '../../types/HitObject';
import { HitObjectParsingFlags } from '../../types/HitObjectParsingFlags';
import { PathType } from '../../types/PathType';
import { Point } from '../../types/Point';
import { assertNever } from '../assertNever';
import { fillBeatmapComputedAttributes } from '../beatmap-difficulty';
import { pointSubtract } from '../point-arithmetic';
import { SliderPath } from '../SliderPath';
import { sortBy } from '../utilities';
import { PartialBeatmap } from './PartialBeatmap';

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

const COMMENT_START = '//';

export function parseBeatmap(content: string): Beatmap {
    const beatmap = createPartialBeatmap();

    const lines = content
        .replace(/\r\n/g, '\n')
        .split('\n')
        .filter(isLineValid);

    parseLinesInto(beatmap, lines);

    sortBy(beatmap.hitObjects, 'startTime');
    sortBy(beatmap.timingPoints, 'time');

    return fillBeatmapComputedAttributes(beatmap as ParsedBeatmap);
}

function createPartialBeatmap(): PartialBeatmap {
    return {
        timingPoints: [],
        timingControlPoints: [],
        difficultyControlPoints: [],
        effectControlPoints: [],
        legacySampleControlPoints: [],
        colors: [],
        hitObjects: [],
    };
}

function isLineValid(line: string): boolean {
    line = line.trim();

    return line.length > 0 && !line.startsWith(COMMENT_START);
}

function parseLinesInto(beatmap: PartialBeatmap, lines: string[]) {
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

        parseLine(beatmap, currentSection, line);
    }
}

function parseLine(beatmap: PartialBeatmap, section: BeatmapSection, line: string) {
    line = stripComments(line);

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
            // events are currently unused
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

function stripComments(line: string): string {
    const commentIndex = line.indexOf(COMMENT_START);

    if (commentIndex >= 0) {
        return line.substr(0, commentIndex);
    }

    return line;
}

function parseGeneralLine(beatmap: PartialBeatmap, line: string) {
    const [key, value] = parseKeyValuePair(line);

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
            beatmap.stackLeniency = parseFloat(value);
            break;
        case 'Mode':
            beatmap.mode = parseInt(value);
            break;
        default:
    }
}

function parseEditorLine(beatmap: PartialBeatmap, line: string) {
    const [key, value] = parseKeyValuePair(line);

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

function parseMetadataLine(beatmap: PartialBeatmap, line: string) {
    const [key, value] = parseKeyValuePair(line);

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

function parseDifficultyLine(beatmap: PartialBeatmap, line: string) {
    const [key, value] = parseKeyValuePair(line);

    switch (key) {
        case 'HPDrainRate':
            beatmap.hpDrainRate = parseFloat(value);
            break;
        case 'CircleSize':
            beatmap.circleSize = parseFloat(value);
            break;
        case 'OverallDifficulty':
            beatmap.overallDifficulty = parseFloat(value);
            break;
        case 'ApproachRate':
            beatmap.approachRate = parseFloat(value);
            break;
        case 'SliderMultiplier':
            beatmap.sliderMultiplier = parseFloat(value);
            break;
        case 'SliderTickRate':
            beatmap.sliderTickRate = parseFloat(value);
            break;
        default:
    }
}

function parseKeyValuePair(line: string): [string, string] {
    return line.split(':').map(p => p.trim()) as [string, string];
}

function parseTimingPointLine(beatmap: PartialBeatmap, line: string) {
    const parts = line.split(',');

    const beatLength = parseFloat(parts[1]);
    const timeSignature = (parts.length > 2) ? parseInt(parts[2]) : 4;

    let kiaiMode = false;
    let omitFirstBarSignature = false;
    if (parts.length > 7) {
        const effectFlags: EffectFlags = parseInt(parts[7]);
        kiaiMode = (effectFlags & EffectFlags.Kiai) > 0;
        omitFirstBarSignature = (effectFlags & EffectFlags.OmitFirstBarLine) > 0;
    }

    beatmap.timingPoints.push({
        time: parseInt(parts[0]),
        beatLength: beatLength,
        timeSignature: (timeSignature !== 0) ? timeSignature : 4,
        sampleSet: (parts.length > 3) ? parseInt(parts[3]) : 0, // TODO: fix fallback
        customSampleBank: (parts.length > 4) ? parseInt(parts[4]) : 0,
        sampleVolume: (parts.length > 5) ? parseInt(parts[5]) : 100,  // TODO: fix fallback
        timingChange: (parts.length > 6) ? parts[6] === '1' : true,
        kiaiMode: kiaiMode,
        omitFirstBarSignature: omitFirstBarSignature,
        speedMultiplier: (beatLength < 0) ? 100 / -beatLength : 1,
    });
}

function parseColorLine(beatmap: PartialBeatmap, line: string) {
    // eslint-disable-next-line
    const [_, value] = parseKeyValuePair(line);
    const colorComponents = value.split(',').map(p => parseInt(p));

    beatmap.colors.push({
        red: colorComponents[0],
        green: colorComponents[1],
        blue: colorComponents[2],
        alpha: (colorComponents.length > 3) ? colorComponents[3] : 255,
    });
}

function parseHitObjectLine(beatmap: PartialBeatmap, line: string) {
    const parts = line.split(',');

    const flags = parseInt(parts[3]) as HitObjectParsingFlags;
    const type = getHitObjectType(flags);

    if (type === null) {
        console.log('Invalid hit object. Ignoring.', line);
        return;
    }

    const baseHitObject: BaseHitObject = {
        x: parseInt(parts[0]),
        y: parseInt(parts[1]),
        startTime: parseInt(parts[2]),
        newCombo: (flags & HitObjectParsingFlags.NewCombo) > 0,
        comboOffset: (type & HitObjectParsingFlags.ComboOffset) / 16,
        soundType: parseInt(parts[4]),

        indexInCurrentCombo: 0,
        comboIndex: 0,
        lastInCombo: false,
    };

    const hitObject = createHitObject(baseHitObject, type, parts.slice(5));
    beatmap.hitObjects.push(hitObject);
}

function getHitObjectType(flags: HitObjectParsingFlags): HitObjectType | null {
    if (flags & HitObjectParsingFlags.Circle) {
        return HitObjectType.Circle;
    }

    if (flags & HitObjectParsingFlags.Slider) {
        return HitObjectType.Slider;
    }

    if (flags & HitObjectParsingFlags.Spinner) {
        return HitObjectType.Spinner;
    }

    return null;
}

function createHitObject(
    baseHitObject: BaseHitObject,
    type: HitObjectType,
    metadata: string[],
): HitObject {
    switch (type) {
        case HitObjectType.Circle:
            return {
                ...baseHitObject,
                type: type,
                metadata: parseCircleMetadata(metadata),
            };
        case HitObjectType.Slider:
            return {
                ...baseHitObject,
                type: type,
                metadata: parseSliderMetadata(metadata, baseHitObject),
            };
        case HitObjectType.Spinner:
            return {
                ...baseHitObject,
                type: type,
                metadata: parseSpinnerMetadata(metadata, baseHitObject),
            };
        default:
            return assertNever(type);
    }
}

function parseCircleMetadata(metadata: string[]): CircleMetadata {
    return {
        soundSamples: metadata,

        // Computed
        stackHeight: 0,
        stackedPosition: {} as Point, // TODO
    };
}

function parseSliderMetadata(metadata: string[], baseHitObject: BaseHitObject): SliderMetadata {
    const [pathType, ...points] = metadata[0].split('|');
    const pathLength = (metadata.length <= 2) ? 0 : parseInt(metadata[2]);

    const controlPoints = points.map(pair => {
        const [x, y] = pair.split(':').map(v => parseInt(v));
        return pointSubtract({ x, y }, baseHitObject);
    });

    return {
        path: new SliderPath(
            pathType as PathType,
            controlPoints,
            pathLength,
        ),
        repeatCount: Math.max(0, parseInt(metadata[1]) - 1),
        soundSamples: metadata.slice(3),

        // Computed
        timingPoint: null,
        difficultyPoint: null,
        velocity: 0,
        tickDistance: 0,
        nestedHitObjects: [],
        stackHeight: 0,
        stackedPosition: {} as Point, // TODO
    };
}

function parseSpinnerMetadata(metadata: string[], baseHitObject: BaseHitObject): SpinnerMetadata {
    return {
        endTime: Math.max(parseInt(metadata[0]), baseHitObject.startTime),
        soundSamples: metadata.slice(1),
        stackedPosition: {} as Point, // TODO
    };
}
