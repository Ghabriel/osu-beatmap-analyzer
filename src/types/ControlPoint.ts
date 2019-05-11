export enum ControlPointType {
    Timing,
    Difficulty,
    Effect,
    LegacySample,
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
