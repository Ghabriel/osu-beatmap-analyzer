import { ParsedBeatmap } from '../types/Beatmap';
import { BaseHitObject, Circle, CircleMetadata, HitObject, HitObjectType, Slider, SliderMetadata, Spinner, SpinnerMetadata } from '../types/HitObject';
import { Point } from '../types/Point';
import { assertNever } from './assertNever';
import { PartialBeatmap } from './parsing/PartialBeatmap';
import { PartialCircle, PartialCircleMetadata, PartialHitObject, PartialSlider, PartialSliderMetadata, PartialSpinner, PartialSpinnerMetadata } from './parsing/PartialHitObject';
import { coalesce } from './utilities';

export function fillBeatmapDefaults(partialBeatmap: PartialBeatmap): ParsedBeatmap {
    const baseDifficulty = {
        hpDrainRate: coalesce(partialBeatmap.baseDifficulty.hpDrainRate, 5),
        circleSize: coalesce(partialBeatmap.baseDifficulty.circleSize, 5),
        overallDifficulty: coalesce(partialBeatmap.baseDifficulty.overallDifficulty, 5),
        approachRate: coalesce(partialBeatmap.baseDifficulty.approachRate, 5),
    };

    return {
        // General
        audioFilename: partialBeatmap.audioFilename || '',
        audioLeadIn: partialBeatmap.audioLeadIn || 0,
        previewTime: partialBeatmap.previewTime || 0,
        countdown: partialBeatmap.countdown || 0,
        stackLeniency: partialBeatmap.stackLeniency || 0,
        mode: partialBeatmap.mode || 0,

        // Editor
        distanceSpacing: partialBeatmap.distanceSpacing || 0,
        beatDivisor: partialBeatmap.beatDivisor || 0,
        gridSize: partialBeatmap.gridSize || 0,

        // Metadata
        title: partialBeatmap.title || '',
        titleUnicode: partialBeatmap.titleUnicode,
        artist: partialBeatmap.artist || '',
        artistUnicode: partialBeatmap.artistUnicode,
        creator: partialBeatmap.creator || '',
        version: partialBeatmap.version || '',
        source: partialBeatmap.source,
        tags: partialBeatmap.tags,
        beatmapId: partialBeatmap.beatmapId,
        beatmapSetId: partialBeatmap.beatmapSetId,

        // Difficulty
        baseDifficulty: baseDifficulty,
        originalBaseDifficulty: { ...baseDifficulty },
        sliderMultiplier: partialBeatmap.sliderMultiplier || 0,
        sliderTickRate: partialBeatmap.sliderTickRate || 0,

        timingPoints: partialBeatmap.timingPoints,
        timingControlPoints: partialBeatmap.timingControlPoints,
        difficultyControlPoints: partialBeatmap.difficultyControlPoints,
        effectControlPoints: partialBeatmap.effectControlPoints,
        legacySampleControlPoints: partialBeatmap.legacySampleControlPoints,
        colors: partialBeatmap.colors,
        hitObjects: createHitObjects(partialBeatmap.hitObjects),
    };
}

function createHitObjects(partialHitObjects: PartialHitObject[]): HitObject[] {
    return partialHitObjects.map(h => createHitObject(h));
}

function createHitObject(partialHitObject: PartialHitObject): HitObject {
    const baseHitObject = createBaseHitObject(partialHitObject);

    switch (partialHitObject.type) {
        case HitObjectType.Circle:
            return createCircle(partialHitObject, baseHitObject);

        case HitObjectType.Slider:
            return createSlider(partialHitObject, baseHitObject);

        case HitObjectType.Spinner:
            return createSpinner(partialHitObject, baseHitObject);

        default:
            return assertNever(partialHitObject);
    }
}

function createBaseHitObject(partialHitObject: PartialHitObject): BaseHitObject {
    return {
        x: partialHitObject.x,
        y: partialHitObject.y,
        startTime: partialHitObject.startTime,
        newCombo: partialHitObject.newCombo,
        comboOffset: partialHitObject.comboOffset,
        soundType: partialHitObject.soundType,
        indexInCurrentCombo: 0,
        comboIndex: 0,
        lastInCombo: false,
    };
}

function createCircle(partialHitObject: PartialCircle, base: BaseHitObject): Circle {
    return {
        ...base,
        type: partialHitObject.type,
        metadata: createCircleMetadata(partialHitObject.metadata),
    };
}

function createCircleMetadata(metadata: PartialCircleMetadata): CircleMetadata {
    return {
        soundSamples: metadata.soundSamples,
        stackHeight: 0,
        stackedPosition: {} as Point, // TODO
    };
}

function createSlider(partialHitObject: PartialSlider, base: BaseHitObject): Slider {
    return {
        ...base,
        type: partialHitObject.type,
        metadata: createSliderMetadata(partialHitObject.metadata, base),
    };
}

function createSliderMetadata(
    metadata: PartialSliderMetadata,
    baseHitObject: BaseHitObject
): SliderMetadata {
    return {
        path: metadata.path,
        repeatCount: metadata.repeatCount,
        soundSamples: metadata.soundSamples,
        timingPoint: null,
        difficultyPoint: null,
        velocity: 0,
        tickDistance: 0,
        nestedHitObjects: [],
        stackHeight: 0,
        stackedPosition: {} as Point, // TODO
    };
}

function createSpinner(partialHitObject: PartialSpinner, base: BaseHitObject): Spinner {
    return {
        ...base,
        type: partialHitObject.type,
        metadata: createSpinnerMetadata(partialHitObject.metadata, base),
    };
}

function createSpinnerMetadata(
    metadata: PartialSpinnerMetadata,
    baseHitObject: BaseHitObject
): SpinnerMetadata {
    return {
        endTime: metadata.endTime,
        soundSamples: metadata.soundSamples,
        stackedPosition: {} as Point, // TODO
    };
}
