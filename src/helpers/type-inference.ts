import { Circle, HitObject, HitObjectType, NestedHitObject, NestedHitObjectType, Slider, SliderCircle, SliderTailCircle, SliderTip, Spinner } from "../types/HitObject";

export function isCircle(hitObject: HitObject): hitObject is Circle {
    return hitObject.type === HitObjectType.Circle;
}

export function isSlider(hitObject: HitObject): hitObject is Slider {
    return hitObject.type === HitObjectType.Slider;
}

export function isSpinner(hitObject: HitObject): hitObject is Spinner {
    return hitObject.type === HitObjectType.Spinner;
}


export function isSliderTip(hitObject: NestedHitObject): hitObject is SliderTip {
    return isSliderCircle(hitObject) || isSliderTailCircle(hitObject);
}

export function isSliderCircle(hitObject: NestedHitObject): hitObject is SliderCircle {
    return hitObject.type === NestedHitObjectType.SliderCircle;
}

export function isSliderTailCircle(hitObject: NestedHitObject): hitObject is SliderTailCircle {
    return hitObject.type === NestedHitObjectType.SliderTailCircle;
}
