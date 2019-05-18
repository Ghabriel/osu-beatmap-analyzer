import { ParsedBeatmap } from '../../types/Beatmap';
import { Clock } from '../../types/Clock';

export abstract class GameMod {
    applyToClock(clock: Clock) { }
    applyToDifficulty(beatmap: ParsedBeatmap) { }
}
