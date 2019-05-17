import { Beatmap } from "../types/Beatmap";
import { Mod } from "../types/Mod";
import { fillBeatmapComputedAttributes } from "./beatmap-difficulty";
import { processBeatmap } from "./beatmap-processing";
import { parseBeatmap } from "./parsing/beatmap-parser";

export function readBeatmapFromString(content: string): Beatmap {
    const partialBeatmap = parseBeatmap(content);
    const beatmap = processBeatmap(partialBeatmap);

    return fillBeatmapComputedAttributes(beatmap);
}

export function changeBeatmapMods(beatmap: Beatmap, mods: Set<Mod>): Beatmap {
    // TODO
    beatmap.circleSize = 7;
    const newBeatmap = processBeatmap(beatmap);
    return fillBeatmapComputedAttributes(newBeatmap);
}
