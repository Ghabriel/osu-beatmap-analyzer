import { CSSProperties } from 'react';
import { SliderPath } from './helpers/SliderPath';

export interface StyleMap {
    [key: string]: CSSProperties;
}

export interface Point {
    x: number;
    y: number;
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
    // TODO
}

export interface Color {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
}

export interface HitObject {
    x: number;
    y: number;
    startTime: number;
    flags: HitObjectFlags;
    soundType: number;
    metadata: HitObjectMetadata;
}

export enum HitObjectFlags {
    Circle = 1,
    Slider = 2,
    NewCombo = 4,
    Spinner = 8,
}

export type HitObjectMetadata = CircleMetadata | SliderMetadata | SpinnerMetadata;

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
