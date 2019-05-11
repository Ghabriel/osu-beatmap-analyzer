import { HitObject } from './HitObject';

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
