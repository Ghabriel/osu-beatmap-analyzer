import { Beatmap, ControlPoint, ControlPointType, HitObject, HitObjectType, ParsedBeatmap, Slider } from '../types';
import { assertNever } from './assertNever';

// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs
const SECTION_LENGTH = 400;

// https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Osu/Beatmaps/OsuBeatmapProcessor.cs#L14
const STACK_DISTANCE = 3;

// HitObject.cs (25)
const CONTROL_POINT_LENIENCY = 1;

const CLOCK_RATE = 1000 / 30;
const NORMALIZED_RADIUS = 52;
const OBJECT_RADIUS = 64;

export function fillBeatmapComputedAttributes(beatmap: ParsedBeatmap): Beatmap {
    createControlPoints(beatmap);

    fillHitObjects(beatmap);

    applyDefaults(beatmap);

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

function createControlPoints(beatmap: ParsedBeatmap) {
    for (const timingPoint of beatmap.timingPoints) {
        if (timingPoint.timingChange) {
            beatmap.timingControlPoints.push({
                type: ControlPointType.Timing,
                time: timingPoint.time,
                beatLength: timingPoint.beatLength,
                timeSignature: timingPoint.timeSignature,
            });
        }

        beatmap.difficultyControlPoints.push({
            type: ControlPointType.Difficulty,
            time: timingPoint.time,
            speedMultiplier: timingPoint.speedMultiplier,
        });

        beatmap.effectControlPoints.push({
            type: ControlPointType.Effect,
            time: timingPoint.time,
            kiaiMode: timingPoint.kiaiMode,
            omitFirstBarSignature: timingPoint.omitFirstBarSignature,
        });

        beatmap.legacySampleControlPoints.push({
            type: ControlPointType.LegacySample,
            time: timingPoint.time,
            customSampleBank: timingPoint.customSampleBank,
            sampleSet: timingPoint.sampleSet,
            sampleVolume: timingPoint.sampleVolume,
        });
    }
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

function applyDefaults(beatmap: ParsedBeatmap) {
    for (const hitObject of beatmap.hitObjects) {
        if (hitObject.type === HitObjectType.Slider) {
            fillSliderComputedAttributes(hitObject, beatmap);
            createNestedHitObjects(hitObject);
        }
    }
}

function fillSliderComputedAttributes(slider: Slider, beatmap: ParsedBeatmap) {
    const BASE_SCORING_DISTANCE = 100;
    const TICK_DISTANCE_MULTIPLIER = 1;

    const timingPoint = getControlPoint(beatmap.timingControlPoints, slider.startTime);
    const difficultyPoint = getControlPoint(beatmap.difficultyControlPoints, slider.startTime);
    const scoringDistance = BASE_SCORING_DISTANCE * beatmap.sliderMultiplier * difficultyPoint!.speedMultiplier;

    slider.metadata.timingPoint = timingPoint;
    slider.metadata.difficultyPoint = difficultyPoint;
    slider.metadata.velocity = scoringDistance / timingPoint!.beatLength;
    slider.metadata.tickDistance = scoringDistance / beatmap.sliderTickRate * TICK_DISTANCE_MULTIPLIER;
}

function getControlPoint<T extends ControlPoint>(list: T[], startTime: number): T | null {
    return list.find(t => t.time === startTime) || null;
}

function createNestedHitObjects(slider: Slider) {
    const LEGACY_LAST_TICK_OFFSET = 36;

    const startTime = slider.startTime;
    const spanCount = slider.metadata.repeatCount + 1;
    const pathDistance = slider.metadata.path.length;
    const endTime = startTime + spanCount * pathDistance / slider.metadata.velocity;
    const duration = endTime - startTime;
    const spanDuration = duration / spanCount;
    const tickDistance = slider.metadata.tickDistance;
}

function preProcessBeatmap(beatmap: ParsedBeatmap) {
    let lastObject: HitObject | null = null;

    for (const hitObject of beatmap.hitObjects) {
        if (hitObject.newCombo) {
            hitObject.indexInCurrentCombo = 0;

            const lastComboIndex = (lastObject !== null) ? lastObject.comboIndex : 0;
            hitObject.comboIndex = lastComboIndex + hitObject.comboOffset + 1;

            if (lastObject !== null) {
                lastObject.lastInCombo = true;
            }
        } else if (lastObject !== null) {
            hitObject.indexInCurrentCombo = lastObject.indexInCurrentCombo + 1;
            hitObject.comboIndex = lastObject.comboIndex;
        }

        lastObject = hitObject;
    }
}

function postProcessBeatmap(beatmap: ParsedBeatmap) {

}
