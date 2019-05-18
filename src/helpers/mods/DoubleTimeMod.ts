import { Clock } from '../../types/Clock';
import { GameMod } from './GameMod';

export class DoubleTimeMod extends GameMod {
    applyToClock(clock: Clock) {
        clock.rate *= 1.5;
    }
}
