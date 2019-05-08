import { Beatmap, DifficultyHitObject, HitObjectFlags, ParsedBeatmap } from '../types';

const CLOCK_RATE = 1000 / 30;
const NORMALIZED_RADIUS = 52;
const OBJECT_RADIUS = 64;

export function fillBeatmapComputedAttributes(beatmap: ParsedBeatmap): Beatmap {
    return {
        ...beatmap,
        aimStrain: getAimStrain(beatmap),
        speedStrain: 0,
        starRating: 0,
    };
}

function getAimStrain(beatmap: ParsedBeatmap): number {
    const difficultyHitObjects = createDifficultyHitObjects(beatmap);

    // TODO
    return 0;
}

function createDifficultyHitObjects(beatmap: ParsedBeatmap): DifficultyHitObject[] {
    const hitObjectRadius = getHitObjectRadius(beatmap);

    return beatmap.hitObjects
        .slice(1)
        .map((current, i) => {
            const lastLast = i > 1 ? beatmap.hitObjects[i - 2] : null;
            const last = beatmap.hitObjects[i - 1];

            const deltaTime = (current.startTime - last.startTime) / CLOCK_RATE;
            const strainTime = Math.max(50, deltaTime);
            const scalingFactor = getScalingFactor(hitObjectRadius);

            if (last.flags & HitObjectFlags.Slider) {
                // TODO
            }

            return { lastLast, last, current };
        });
}

function getHitObjectRadius(beatmap: ParsedBeatmap): number {
    const scale = 0.85 - 0.07 * beatmap.circleSize;
    return OBJECT_RADIUS * scale;
}

function getScalingFactor(hitObjectRadius: number): number {
    const scalingFactor = NORMALIZED_RADIUS / hitObjectRadius;

    if (hitObjectRadius < 30) {
        const smallCircleBonus = Math.min(30 - hitObjectRadius, 5) / 50;
        return scalingFactor * (1 + smallCircleBonus);
    }

    return scalingFactor;
}
