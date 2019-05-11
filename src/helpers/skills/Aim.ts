import { DifficultyHitObject, HitObject, HitObjectType, Spinner } from '../../types';
import { Skill } from './Skill';

function isSpinner(hitObject: HitObject): hitObject is Spinner {
    return hitObject.type === HitObjectType.Spinner;
}

export class Aim extends Skill {
    private readonly ANGLE_BONUS_BEGIN = Math.PI / 3;
    private readonly TIMING_THRESHOLD = 107;

    // override
    protected skillMultiplier: number = 26.25;
    // override
    protected strainDecayBase: number = 0.15;

    // override
    protected strainValueOf(object: DifficultyHitObject): number{
        if (isSpinner(object.current)) {
            return 0;
        }

        let result = 0;

        if (this.previous.length > 0) {
            const previousObject = this.previous[0];

            if (object.angle !== null && object.angle > this.ANGLE_BONUS_BEGIN) {
                const scale = 90;

                const angleBonus = Math.sqrt(
                    Math.max(previousObject.jumpDistance - scale, 0)
                    * Math.pow(Math.sin(object.angle - this.ANGLE_BONUS_BEGIN), 2)
                    * Math.max(object.jumpDistance - scale, 0)
                );
                result = 1.5 * this.applyDiminishingExp(Math.max(0, angleBonus)) / Math.max(this.TIMING_THRESHOLD, previousObject.strainTime);
            }
        }

        const jumpDistanceExp = this.applyDiminishingExp(object.jumpDistance);
        const travelDistanceExp = this.applyDiminishingExp(object.travelDistance);

        return Math.max(
            result + (jumpDistanceExp + travelDistanceExp + Math.sqrt(travelDistanceExp * jumpDistanceExp)) / Math.max(object.strainTime, this.TIMING_THRESHOLD),
            (Math.sqrt(travelDistanceExp * jumpDistanceExp) + jumpDistanceExp + travelDistanceExp) / object.strainTime
        );
    }

    private applyDiminishingExp(value: number): number {
        return Math.pow(value, 0.99);
    }
}
