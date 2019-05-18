import { ParsedBeatmap } from '../../types/Beatmap';
import { GameMod } from './GameMod';

export class EasyMod extends GameMod {
    applyToDifficulty(beatmap: ParsedBeatmap) {
        const ratio = 0.5;
        beatmap.hpDrainRate *= ratio;
        beatmap.circleSize *= ratio;
        beatmap.overallDifficulty *= ratio;
        beatmap.approachRate *= ratio;
    }
}
