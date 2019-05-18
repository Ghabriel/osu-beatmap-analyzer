import { Mod } from '../../types/Mod';
import { DoubleTimeMod } from './DoubleTimeMod';
import { EasyMod } from './EasyMod';
import { GameMod } from './GameMod';
import { HalfTimeMod } from './HalfTimeMod';
import { HardRockMod } from './HardRockMod';

export type ModTable = {
    [M in Mod]: GameMod;
}

export const MOD_TABLE: ModTable = {
    [Mod.Easy]: new EasyMod(),
    [Mod.HalfTime]: new HalfTimeMod(),
    [Mod.HardRock]: new HardRockMod(),
    [Mod.DoubleTime]: new DoubleTimeMod(),
};
