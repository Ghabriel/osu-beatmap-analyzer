import { Beatmap, HitObjectType, ParsedBeatmap } from '../types';
import { assertNever } from './assertNever';

// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs
const SECTION_LENGTH = 400;

// https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Osu/Beatmaps/OsuBeatmapProcessor.cs#L14
const STACK_DISTANCE = 3;

const CLOCK_RATE = 1000 / 30;
const NORMALIZED_RADIUS = 52;
const OBJECT_RADIUS = 64;

export function fillBeatmapComputedAttributes(beatmap: ParsedBeatmap): Beatmap {
    fillHitObjects(beatmap);

    // TODO: apply mods, if any
    // https://github.com/ppy/osu/blob/master/osu.Game/Beatmaps/WorkingBeatmap.cs#L90
    // https://github.com/ppy/osu/blob/master/osu.Game/Beatmaps/WorkingBeatmap.cs#L97

    preProcessBeatmap(beatmap);

    // TODO: apply mods, if any
    // https://github.com/ppy/osu/blob/master/osu.Game/Beatmaps/WorkingBeatmap.cs#L114

    postProcessBeatmap(beatmap);

    // TODO: apply mods, if any
    // https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs#L45

    return {
        ...beatmap,
        aimStrain: 0,//getAimStrain(beatmap),
        speedStrain: 0,
        starRating: 0,
    };
}

// TODO: find a better name
function fillHitObjects(beatmap: ParsedBeatmap) {
    let firstObject = true;
    let forceNewCombo = false;
    let extraComboOffset = 0;

    for (const hitObject of beatmap.hitObjects) {
        switch (hitObject.type) {
            case HitObjectType.Circle:
            case HitObjectType.Slider:
                hitObject.newCombo = firstObject || forceNewCombo || hitObject.newCombo;
                hitObject.comboOffset += extraComboOffset;

                forceNewCombo = false;
                extraComboOffset = 0;
                break;
            case HitObjectType.Spinner:
                forceNewCombo = forceNewCombo || hitObject.newCombo;
                extraComboOffset += hitObject.comboOffset;
                break;
            default:
                return assertNever(hitObject);
        }

        firstObject = false;
    }
}

function preProcessBeatmap(beatmap: ParsedBeatmap) {

}

function postProcessBeatmap(beatmap: ParsedBeatmap) {

}
