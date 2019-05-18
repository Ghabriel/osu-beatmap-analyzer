import { BaseDifficultyAttributes } from '../../types/Beatmap';
import { GameMod } from './GameMod';

export class EasyMod extends GameMod {
    applyToDifficulty(difficulty: BaseDifficultyAttributes) {
        const ratio = 0.5;
        difficulty.hpDrainRate *= ratio;
        difficulty.circleSize *= ratio;
        difficulty.overallDifficulty *= ratio;
        difficulty.approachRate *= ratio;
    }
}
