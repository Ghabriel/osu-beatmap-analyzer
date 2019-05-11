import { HitObject, HitObjectType, Spinner } from '../types';

export function isSpinner(hitObject: HitObject): hitObject is Spinner {
    return hitObject.type === HitObjectType.Spinner;
}
