import { BaseDifficultyAttributes } from '../../types/Beatmap';
import { GameMod } from './GameMod';

export class HardRockMod extends GameMod {
    applyToDifficulty(difficulty: BaseDifficultyAttributes) {
        difficulty.hpDrainRate = Math.min(10, difficulty.hpDrainRate * 1.4);
        difficulty.circleSize = Math.min(10, difficulty.circleSize * 1.3);
        difficulty.overallDifficulty = Math.min(10, difficulty.overallDifficulty * 1.4);
        difficulty.approachRate = Math.min(10, difficulty.approachRate * 1.4);
    }
}
