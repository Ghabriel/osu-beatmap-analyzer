import { Clock } from '../../types/Clock';
import { GameMod } from './GameMod';

export class HalfTimeMod extends GameMod {
    applyToClock(clock: Clock) {
        clock.rate *= 0.75;
    }
}
