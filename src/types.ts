import { CSSProperties } from 'react';
import { SliderPath } from './helpers/SliderPath';

export interface StyleMap {
    [key: string]: CSSProperties;
}

export interface Point {
    x: number;
    y: number;
}

export interface DifficultyHitObject {
    lastLast: HitObject | null;
    last: HitObject;
    current: HitObject;
}

export interface ParsedBeatmap {
    // General
    audioFilename: string;
    audioLeadIn: number;
    previewTime: number;
    countdown: number;
    stackLeniency: number;
    mode: number;

    // Editor
    distanceSpacing: number;
    beatDivisor: number;
    gridSize: number;

    // Metadata
    title: string;
    titleUnicode: string;
    artist: string;
    artistUnicode: string;
    creator: string;
    version: string;
    source: string;
    tags: string[];
    beatmapId: number;
    beatmapSetId: number;

    // Difficulty
    hpDrainRate: number;
    circleSize: number;
    overallDifficulty: number;
    approachRate: number;
    sliderMultiplier: number;
    sliderTickRate: number;

    timingPoints: TimingPoint[];
    controlPoints: ControlPoint[];
    colors: Color[];
    hitObjects: HitObject[];
}

export type Beatmap = ParsedBeatmap & {
    // Computed
    aimStrain: number;
    speedStrain: number;
    starRating: number;
};

export interface TimingPoint {
    time: number;
    beatLength: number;
    timeSignature: number; // unused
    sampleSet: number; // unused
    customSampleBank: number; // unused
    sampleVolume: number; // unused
    timingChange: boolean;
    kiaiMode: boolean; // unused
    omitFirstBarSignature: boolean; // unused

    // Computed
    speedMultiplier: number;
}

export enum EffectFlags {
    None = 0,
    Kiai = 1,
    OmitFirstBarLine = 8
}

export type ControlPoint
    = TimingControlPoint
    | DifficultyControlPoint
    | EffectControlPoint
    | LegacySampleControlPoint
    ;

export interface TimingControlPoint {
    type: ControlPointType.Timing;
    time: number;
    beatLength: number;
    timeSignature: number; // unused
}

export interface DifficultyControlPoint {
    type: ControlPointType.Difficulty;
    time: number;
    speedMultiplier: number;
}

export interface EffectControlPoint {
    type: ControlPointType.Effect;
    time: number;
    kiaiMode: boolean; // unused
    omitFirstBarSignature: boolean; // unused
}

export interface LegacySampleControlPoint {
    type: ControlPointType.LegacySample;
    time: number;
    sampleSet: number; // unused
    customSampleBank: number; // unused
    sampleVolume: number; // unused
}

export enum ControlPointType {
    Timing,
    Difficulty,
    Effect,
    LegacySample,
}

export interface Color {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
}

export type HitObject = Circle | Slider | Spinner;

export interface BaseHitObject {
    x: number;
    y: number;
    startTime: number;
    // type: HitObjectType;
    newCombo: boolean;
    comboOffset: number;
    soundType: number;
    // metadata: HitObjectMetadata;

    // Computed
    indexInCurrentCombo: number;
    comboIndex: number;
    lastInCombo: boolean;
}

export interface Circle extends BaseHitObject {
    type: HitObjectType.Circle;
    metadata: CircleMetadata;
}

export interface Slider extends BaseHitObject {
    type: HitObjectType.Slider;
    metadata: SliderMetadata;
}

export interface Spinner extends BaseHitObject {
    type: HitObjectType.Spinner;
    metadata: SpinnerMetadata;
}

export enum HitObjectType {
    Circle,
    Slider,
    Spinner,
}

export enum HitObjectFlags {
    Circle = 1,
    Slider = 2,
    NewCombo = 4,
    Spinner = 8,
    ComboOffset = 16 | 32 | 64,
}

// export type HitObjectMetadata = CircleMetadata | SliderMetadata | SpinnerMetadata;

export interface CircleMetadata {
    soundSamples: string[];
}

export interface SliderMetadata {
    path: SliderPath;
    repeatCount: number;
    soundSamples: string[];
}

export enum PathType {
    Catmull = 'C',
    Bezier = 'B',
    Linear = 'L',
    PerfectCurve = 'P',
}

export interface SpinnerMetadata {
    endTime: number;
    soundSamples: string[];
}
