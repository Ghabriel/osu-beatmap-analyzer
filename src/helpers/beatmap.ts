import { Beatmap } from "../types/Beatmap";
import { Clock } from "../types/Clock";
import { Mod } from "../types/Mod";
import { fillBeatmapComputedAttributes } from "./beatmap-difficulty";
import { processBeatmap } from "./beatmap-processing";
import { GameMod } from "./mods/GameMod";
import { MOD_TABLE } from "./mods/mod-table";
import { parseBeatmap } from "./parsing/beatmap-parser";

export function readBeatmapFromString(content: string): Beatmap {
    const partialBeatmap = parseBeatmap(content);
    const clock = createClock();
    const beatmap = processBeatmap(partialBeatmap, clock);

    return fillBeatmapComputedAttributes(beatmap, clock);
}

export function changeBeatmapMods(beatmap: Beatmap, mods: Set<Mod>): Beatmap {
    resetDifficultyAttributes(beatmap);
    const clock = createClock();
    const modInstances = getModInstances(mods);
    const newBeatmap = processBeatmap(beatmap, clock, modInstances);
    return fillBeatmapComputedAttributes(newBeatmap, clock);
}

function createClock(): Clock {
    return { rate: 1 };
}

function resetDifficultyAttributes(beatmap: Beatmap) {
    beatmap.baseDifficulty = { ...beatmap.originalBaseDifficulty };
}

function getModInstances(mods: Set<Mod>): Set<GameMod> {
    const modInstances = new Set<GameMod>();

    for (const mod of mods) {
        modInstances.add(MOD_TABLE[mod]);
    }

    return modInstances;
}
