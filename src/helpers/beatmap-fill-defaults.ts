import { ParsedBeatmap } from '../types/Beatmap';
import { BaseHitObject, CircleMetadata, HitObject, HitObjectType, SliderMetadata, SpinnerMetadata } from '../types/HitObject';
import { Point } from '../types/Point';
import { assertNever } from './assertNever';
import { PartialBeatmap } from './parsing/PartialBeatmap';
import { PartialCircleMetadata, PartialHitObject, PartialSliderMetadata, PartialSpinnerMetadata } from './parsing/PartialHitObject';
import { coalesce } from './utilities';

export function fillBeatmapDefaults(partialBeatmap: PartialBeatmap): ParsedBeatmap {
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
        hpDrainRate: coalesce(partialBeatmap.hpDrainRate, 5),
        circleSize: coalesce(partialBeatmap.circleSize, 5),
        overallDifficulty: coalesce(partialBeatmap.overallDifficulty, 5),
        approachRate: coalesce(partialBeatmap.approachRate, 5),
        sliderMultiplier: partialBeatmap.sliderMultiplier || 0,
        sliderTickRate: partialBeatmap.sliderTickRate || 0,

        timingPoints: partialBeatmap.timingPoints,
        timingControlPoints: partialBeatmap.timingControlPoints,
        difficultyControlPoints: partialBeatmap.difficultyControlPoints,
        effectControlPoints: partialBeatmap.effectControlPoints,
        legacySampleControlPoints: partialBeatmap.legacySampleControlPoints,
        colors: partialBeatmap.colors,
        hitObjects: fillHitObjects(partialBeatmap.hitObjects),
    };
}

function fillHitObjects(partialHitObjects: PartialHitObject[]): HitObject[] {
    return partialHitObjects.map(h => fillHitObject(h));
}

function fillHitObject(partialHitObject: PartialHitObject): HitObject {
    const baseHitObject = fillBaseHitObject(partialHitObject);

    switch (partialHitObject.type) {
        case HitObjectType.Circle:
            return {
                ...baseHitObject,
                type: partialHitObject.type,
                metadata: fillCircleMetadata(partialHitObject.metadata),
            };
        case HitObjectType.Slider:
            return {
                ...baseHitObject,
                type: partialHitObject.type,
                metadata: fillSliderMetadata(partialHitObject.metadata, baseHitObject),
            };
        case HitObjectType.Spinner:
            return {
                ...baseHitObject,
                type: partialHitObject.type,
                metadata: fillSpinnerMetadata(partialHitObject.metadata, baseHitObject),
            };
        default:
            return assertNever(partialHitObject);
    }
}

function fillBaseHitObject(partialHitObject: PartialHitObject): BaseHitObject {
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

function fillCircleMetadata(metadata: PartialCircleMetadata): CircleMetadata {
    return {
        soundSamples: metadata.soundSamples,
        stackHeight: 0,
        stackedPosition: {} as Point, // TODO
    };
}

function fillSliderMetadata(
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

function fillSpinnerMetadata(
    metadata: PartialSpinnerMetadata,
    baseHitObject: BaseHitObject
): SpinnerMetadata {
    return {
        endTime: metadata.endTime,
        soundSamples: metadata.soundSamples,
        stackedPosition: {} as Point, // TODO
    };
}
