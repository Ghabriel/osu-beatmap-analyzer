import { Color } from './Color';
import { DifficultyControlPoint, EffectControlPoint, LegacySampleControlPoint, TimingControlPoint } from './ControlPoint';
import { DifficultyHitObject } from './DifficultyHitObject';
import { HitObject } from './HitObject';
import { TimingPoint } from './TimingPoint';

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
    titleUnicode?: string;
    artist: string;
    artistUnicode?: string;
    creator: string;
    version: string;
    source?: string;
    tags?: string[];
    beatmapId?: number;
    beatmapSetId?: number;

    // Difficulty
    baseDifficulty: BaseDifficultyAttributes;
    originalBaseDifficulty: BaseDifficultyAttributes;
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

export interface Beatmap extends ParsedBeatmap {
    derivedDifficulty: DerivedDifficultyAttributes;
    difficultyHitObjects: DifficultyHitObject[];
}

export interface BaseDifficultyAttributes {
    hpDrainRate: number;
    circleSize: number;
    overallDifficulty: number;
    approachRate: number;
}

export interface DerivedDifficultyAttributes {
    starRating: number;
    // mods: number;
    aimStrain: number;
    speedStrain: number;
    maxCombo: number;
    approachRate: ApproachRateData;
    overallDifficulty: OverallDifficultyData;
}

export interface ApproachRateData {
    value: number;
    toleranceMS: number;
}

export interface OverallDifficultyData {
    value: number;
    toleranceMS: number;
}
