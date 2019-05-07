export interface Beatmap {
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

export type HitObjectMetadata = SliderMetadata | SpinnerMetadata;

export interface SliderMetadata {
    pathType: PathType;
    spanCount: number;
    pathLength: number;
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
