import { SliderPath } from '../helpers/SliderPath';
import { DifficultyControlPoint, TimingControlPoint } from './ControlPoint';
import { Point } from './Point';

export enum HitObjectType {
    Circle,
    Slider,
    Spinner,
}

export type HitObject = Circle | Slider | Spinner;

export interface BaseHitObject {
    x: number;
    y: number;
    startTime: number;
    newCombo: boolean;
    comboOffset: number;
    soundType: number;

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
