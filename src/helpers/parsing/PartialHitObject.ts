import { HitObjectType } from '../../types/HitObject';
import { SliderPath } from '../SliderPath';

export type PartialHitObject = PartialCircle | PartialSlider | PartialSpinner;

export interface PartialBaseHitObject {
    x: number;
    y: number;
    startTime: number;
    newCombo: boolean;
    comboOffset: number;
    soundType: number;
}

export interface PartialCircle extends PartialBaseHitObject {
    type: HitObjectType.Circle;
    metadata: PartialCircleMetadata;
}

export interface PartialSlider extends PartialBaseHitObject {
    type: HitObjectType.Slider;
    metadata: PartialSliderMetadata;
}

export interface PartialSpinner extends PartialBaseHitObject {
    type: HitObjectType.Spinner;
    metadata: PartialSpinnerMetadata;
}


export interface PartialCircleMetadata {
    soundSamples: string[];
}

export interface PartialSliderMetadata {
    path: SliderPath;
    repeatCount: number;
    soundSamples: string[];
}

export interface PartialSpinnerMetadata {
    endTime: number;
    soundSamples: string[];
}
