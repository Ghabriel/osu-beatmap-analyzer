import { Beatmap } from "../types/Beatmap";
import { fillBeatmapComputedAttributes } from "./beatmap-difficulty";
import { processBeatmap } from "./beatmap-processing";
import { parseBeatmap } from "./parsing/beatmap-parser";

export function readBeatmapFromString(content: string): Beatmap {
    const partialBeatmap = parseBeatmap(content);
    const beatmap = processBeatmap(partialBeatmap);

    return fillBeatmapComputedAttributes(beatmap);
}
