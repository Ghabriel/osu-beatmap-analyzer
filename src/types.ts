import { CSSProperties } from 'react';
import { HitObject } from './types/HitObject';

export interface StyleMap {
    [key: string]: CSSProperties;
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

export enum EffectFlags {
    None = 0,
    Kiai = 1,
    OmitFirstBarLine = 8
}

export enum HitObjectFlags {
    Circle = 1,
    Slider = 2,
    NewCombo = 4,
    Spinner = 8,
    ComboOffset = 16 | 32 | 64,
}
