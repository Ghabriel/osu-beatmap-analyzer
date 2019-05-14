import { Color } from '../../types/Color';
import { DifficultyControlPoint, EffectControlPoint, LegacySampleControlPoint, TimingControlPoint } from '../../types/ControlPoint';
import { TimingPoint } from '../../types/TimingPoint';
import { PartialHitObject } from './PartialHitObject';

export interface PartialBeatmap {
    // General
    audioFilename?: string;
    audioLeadIn?: number;
    previewTime?: number;
    countdown?: number;
    stackLeniency?: number;
    mode?: number;

    // Editor
    distanceSpacing?: number;
    beatDivisor?: number;
    gridSize?: number;

    // Metadata
    title?: string;
    titleUnicode?: string;
    artist?: string;
    artistUnicode?: string;
    creator?: string;
    version?: string;
    source?: string;
    tags?: string[];
    beatmapId?: number;
    beatmapSetId?: number;

    // Difficulty
    hpDrainRate?: number;
    circleSize?: number;
    overallDifficulty?: number;
    approachRate?: number;
    sliderMultiplier?: number;
    sliderTickRate?: number;

    timingPoints: TimingPoint[];
    // controlPoints: ControlPoint[];
    timingControlPoints: TimingControlPoint[];
    difficultyControlPoints: DifficultyControlPoint[];
    effectControlPoints: EffectControlPoint[];
    legacySampleControlPoints: LegacySampleControlPoint[];
    colors: Color[];
    hitObjects: PartialHitObject[];
}
