import { ParsedBeatmap } from '../../types/Beatmap';
import { GameMod } from './GameMod';

export class HardRockMod extends GameMod {
    applyToDifficulty(beatmap: ParsedBeatmap) {
        beatmap.hpDrainRate = Math.min(10, beatmap.hpDrainRate * 1.4);
        beatmap.circleSize = Math.min(10, beatmap.circleSize * 1.3);
        beatmap.overallDifficulty = Math.min(10, beatmap.overallDifficulty * 1.4);
        beatmap.approachRate = Math.min(10, beatmap.approachRate * 1.4);
    }
}
