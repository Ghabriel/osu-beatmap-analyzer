import { DifficultyHitObject } from '../../types';
import { isSpinner } from '../type-inference';
import { Skill } from './Skill';

export class Speed extends Skill {
    private readonly SINGLE_SPACING_THRESHOLD = 125;

    private readonly ANGLE_BONUS_BEGIN = 5 * Math.PI / 6;
    private readonly PI_OVER_4 = Math.PI / 4;
    private readonly PI_OVER_2 = Math.PI / 2;

    // override
    protected skillMultiplier: number = 1400;
    // override
    protected strainDecayBase: number = 0.3;

    private readonly MIN_SPEED_BONUS = 75; // ~200BPM
    private readonly MAX_SPEED_BONUS = 45; // ~330BPM
    private readonly SPEED_BALANCING_FACTOR = 40;

    // override
    protected strainValueOf(object: DifficultyHitObject): number {
        if (isSpinner(object.current)) {
            return 0;
        }

        const distance = Math.min(this.SINGLE_SPACING_THRESHOLD, object.travelDistance + object.jumpDistance);
        const deltaTime = Math.max(this.MAX_SPEED_BONUS, object.deltaTime);

        let speedBonus = 1.0;
        if (deltaTime < this.MIN_SPEED_BONUS) {
            speedBonus = 1 + Math.pow((this.MIN_SPEED_BONUS - deltaTime) / this.SPEED_BALANCING_FACTOR, 2);
        }

        let angleBonus = 1.0;

        if (object.angle !== null && object.angle < this.ANGLE_BONUS_BEGIN) {
            angleBonus = 1 + Math.pow(Math.sin(1.5 * (this.ANGLE_BONUS_BEGIN - object.angle)), 2) / 3.57;

            if (object.angle < this.PI_OVER_2) {
                angleBonus = 1.28;
                if (distance < 90 && object.angle < this.PI_OVER_4) {
                    angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1);
                } else if (distance < 90) {
                    angleBonus += (1 - angleBonus) * Math.min((90 - distance) / 10, 1) * Math.sin((this.PI_OVER_2 - object.angle) / this.PI_OVER_4);
                }
            }
        }

        return (1 + (speedBonus - 1) * 0.75) * angleBonus * (0.95 + speedBonus * Math.pow(distance / this.SINGLE_SPACING_THRESHOLD, 3.5)) / object.strainTime;
    }

}
