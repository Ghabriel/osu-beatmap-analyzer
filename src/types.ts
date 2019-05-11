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
    deltaTime: number;
    strainTime: number;
    travelDistance: number;
    jumpDistance: number;
    angle: number | null;
}

export enum PathType {
    Catmull = 'C',
    Bezier = 'B',
    Linear = 'L',
    PerfectCurve = 'P',
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
    // controlPoints: ControlPoint[];
    timingControlPoints: TimingControlPoint[];
    difficultyControlPoints: DifficultyControlPoint[];
    effectControlPoints: EffectControlPoint[];
    legacySampleControlPoints: LegacySampleControlPoint[];
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

    // Computed
    stackHeight: number;
    stackedPosition: Point;
}

export interface SliderMetadata {
    path: SliderPath;
    repeatCount: number;
    soundSamples: string[];

    // Computed
    timingPoint: TimingControlPoint | null;
    difficultyPoint: DifficultyControlPoint | null;
    velocity: number;
    tickDistance: number;
    nestedHitObjects: NestedHitObject[];
    stackHeight: number;
    stackedPosition: Point;
}

export enum NestedHitObjectType {
    SliderCircle,
    SliderTick,
    RepeatPoint,
    SliderTailCircle,
}

export type NestedHitObject = SliderTick | SliderCircle | SliderTailCircle | RepeatPoint;

export interface SliderTick {
    type: NestedHitObjectType.SliderTick;
    spanIndex: number;
    spanStartTime: number;
    startTime: number;
    position: Point;
    stackHeight: number;
    scale: number;
}

export type SliderTip = SliderCircle | SliderTailCircle;

export interface SliderCircle {
    type: NestedHitObjectType.SliderCircle;
    startTime: number;
    position: Point;
    indexInCurrentCombo: number;
    comboIndex: number;
}

export interface SliderTailCircle {
    type: NestedHitObjectType.SliderTailCircle;
    startTime: number;
    position: Point;
    indexInCurrentCombo: number;
    comboIndex: number;
}

export interface RepeatPoint {
    type: NestedHitObjectType.RepeatPoint;
    repeatIndex: number;
    spanDuration: number;
    startTime: number;
    position: Point;
    stackHeight: number;
    scale: number;
}

export interface SpinnerMetadata {
    endTime: number;
    soundSamples: string[];

    // Computed
    stackedPosition: Point;
}
