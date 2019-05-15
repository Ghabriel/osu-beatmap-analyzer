import { Beatmap, ParsedBeatmap } from '../types/Beatmap';
import { DifficultyHitObject } from '../types/DifficultyHitObject';
import { HitObject, HitObjectType, NestedHitObject, Slider } from '../types/HitObject';
import { Point } from '../types/Point';
import { assertNever } from './assertNever';
import { getHitObjectScale, getSliderComputedProperties, SliderComputedProperties } from './beatmap-processing';
import { dotProduct, getNorm, operate, pointMultiply, pointNormalize, pointSubtract, pointSum } from './point-arithmetic';
import { Aim } from './skills/Aim';
import { Skill } from './skills/Skill';
import { Speed } from './skills/Speed';
import { isSlider } from './type-inference';

// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs
const SECTION_LENGTH = 400;

// https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Osu/Beatmaps/OsuBeatmapProcessor.cs#L14
const STACK_DISTANCE = 3;

// HitObject.cs (25)
const CONTROL_POINT_LENIENCY = 1;

// const CLOCK_RATE = 1000 / 30;
const CLOCK_RATE = 1;

export function fillBeatmapComputedAttributes(beatmap: ParsedBeatmap): Beatmap {
    const difficultyHitObjects = createDifficultyHitObjects(beatmap);

    const difficultyAttributes = calculate(difficultyHitObjects, beatmap);

    if (difficultyAttributes === null) {
        throw new Error('Beatmap too small');
    }

    return {
        ...beatmap,
        ...difficultyAttributes,
        difficultyHitObjects,
    };
}

function createDifficultyHitObjects(beatmap: ParsedBeatmap): DifficultyHitObject[] {
    const hitObjectRadius = getHitObjectRadius(beatmap);
    const scalingFactor = getScalingFactor(hitObjectRadius);
    const result: DifficultyHitObject[] = [];

    for (let i = 1; i < beatmap.hitObjects.length; i++) {
        const lastLast = i > 1 ? beatmap.hitObjects[i - 2] : null;
        const last = beatmap.hitObjects[i - 1];
        const current = beatmap.hitObjects[i];

        const difficultyHitObject = createDifficultyHitObject(
            lastLast,
            last,
            current,
            beatmap,
            scalingFactor
        );
        result.push(difficultyHitObject);
    }

    return result.sort((a, b) => a.current.startTime - b.current.startTime);
}

function createDifficultyHitObject(
    lastLast: HitObject | null,
    last: HitObject,
    current: HitObject,
    beatmap: ParsedBeatmap,
    scalingFactor: number,
): DifficultyHitObject {
    const deltaTime = (current.startTime - last.startTime) / CLOCK_RATE;
    const strainTime = Math.max(50, deltaTime);

    const lastTraversalData = getHitObjectTraversalData(last, beatmap);
    const travelDistance = lastTraversalData.lazyTravelDistance * scalingFactor;
    const lastCursorPosition = lastTraversalData.lazyEndPosition;
    const jumpDistance = scalingFactor * getNorm(
        pointSubtract(current.metadata.stackedPosition, lastCursorPosition)
    );

    const angle = (lastLast === null)
        ? null
        : getAngle(lastLast, last, current, lastCursorPosition, beatmap);

    return {
        lastLast,
        last,
        current,
        deltaTime,
        strainTime,
        travelDistance,
        jumpDistance,
        angle,
    };
}

function getAngle(
    lastLast: HitObject,
    last: HitObject,
    current: HitObject,
    lastCursorPosition: Point,
    beatmap: ParsedBeatmap,
): number {
    const lastLastTraversalData = getHitObjectTraversalData(lastLast, beatmap);
    const lastLastCursorPosition = lastLastTraversalData.lazyEndPosition;

    const v1 = pointSubtract(lastLastCursorPosition, last.metadata.stackedPosition);
    const v2 = pointSubtract(current.metadata.stackedPosition, lastCursorPosition);

    const dot = dotProduct(v1, v2);
    const det = v1.x * v2.y - v1.y * v2.x;

    return Math.abs(Math.atan2(det, dot));
}

function getHitObjectTraversalData(hitObject: HitObject, beatmap: ParsedBeatmap): SliderTraversalData {
    switch (hitObject.type) {
        case HitObjectType.Circle:
            return {
                lazyEndPosition: hitObject.metadata.stackedPosition,
                lazyTravelDistance: 0,
            };

        case HitObjectType.Slider:
            return getSliderTraversalData(hitObject, beatmap);

        case HitObjectType.Spinner:
            return {
                lazyEndPosition: { x: 0, y: 0 },
                lazyTravelDistance: 0,
            };

        default:
            return assertNever(hitObject);
    }
}

function getHitObjectRadius(beatmap: ParsedBeatmap): number {
    const OBJECT_RADIUS = 64;
    return OBJECT_RADIUS * getHitObjectScale(beatmap);
}

function getScalingFactor(hitObjectRadius: number): number {
    const NORMALIZED_RADIUS = 52;
    const scalingFactor = NORMALIZED_RADIUS / hitObjectRadius;

    if (hitObjectRadius < 30) {
        const smallCircleBonus = Math.min(30 - hitObjectRadius, 5) / 50;
        return scalingFactor * (1 + smallCircleBonus);
    }

    return scalingFactor;
}

interface SliderTraversalData {
    lazyEndPosition: Point;
    lazyTravelDistance: number;
}

function getSliderTraversalData(slider: Slider, beatmap: ParsedBeatmap): SliderTraversalData {
    let lazyEndPosition = slider.metadata.stackedPosition;
    let lazyTravelDistance = 0;

    const approxFollowCircleRadius = getHitObjectRadius(beatmap) * 3;
    const computedProperties = getSliderComputedProperties(slider);

    slider.metadata.nestedHitObjects.slice(1).forEach(nested => {
        const progress = getNestedHitObjectProgress(nested, computedProperties);
        const pathPosition = slider.metadata.path.positionAt(progress);

        const diff = operate(slider.metadata.stackedPosition)
            .sum(pathPosition)
            .subtract(lazyEndPosition)
            .get();

        let dist = getNorm(diff);

        if (dist > approxFollowCircleRadius) {
            pointNormalize(diff);
            dist -= approxFollowCircleRadius;
            lazyEndPosition = pointSum(lazyEndPosition, pointMultiply(diff, dist));
            lazyTravelDistance += dist;
        }
    });

    return { lazyEndPosition, lazyTravelDistance };
}

function getNestedHitObjectProgress(
    nestedHitObject: NestedHitObject,
    sliderProperties: SliderComputedProperties,
): number {
    const { startTime, spanDuration } = sliderProperties;
    const progress = (nestedHitObject.startTime - startTime) / spanDuration;

    if (progress % 2 >= 1) {
        return 1 - progress % 1;
    } else {
        return progress % 1;
    }
}

function calculate(
    difficultyHitObjects: DifficultyHitObject[],
    beatmap: ParsedBeatmap
): DifficultyAttributes | null {
    const BASE_SECTION_LENGTH = 400;
    const sectionLength = BASE_SECTION_LENGTH * CLOCK_RATE;

    let currentSectionEnd = Math.ceil(beatmap.hitObjects[0].startTime / sectionLength) * sectionLength;

   const skills: Skill[] = [new Aim(), new Speed()];

    for (const object of difficultyHitObjects) {
        while (object.current.startTime > currentSectionEnd) {
            for (const skill of skills) {
                skill.saveCurrentPeak();
                skill.startNewSectionFrom(currentSectionEnd);
            }

            currentSectionEnd += sectionLength;
        }

        for (const skill of skills) {
            skill.process(object);
        }
    }

    for (const skill of skills) {
        skill.saveCurrentPeak();
    }

    return createDifficultyAttributes(skills, beatmap);
}

interface DifficultyAttributes {
    starRating: number;
    // mods: number;
    aimStrain: number;
    speedStrain: number;
    // approachRate: number;
    // overallDifficulty: number;
    maxCombo: number;
}

function createDifficultyAttributes(skills: Skill[], beatmap: ParsedBeatmap): DifficultyAttributes | null {
    if (beatmap.hitObjects.length === 0) {
        return null;
    }

    const DIFFICULTY_MULTIPLIER = 0.0675;

    const [aim, speed] = skills;
    const aimStrain = Math.sqrt(aim.difficultyValue()) * DIFFICULTY_MULTIPLIER;
    const speedStrain = Math.sqrt(speed.difficultyValue()) * DIFFICULTY_MULTIPLIER;
    const starRating = aimStrain + speedStrain + Math.abs(aimStrain - speedStrain) / 2;
    // const starRating = Math.max(aimStrain, speedStrain) + (aimStrain + speedStrain) / 2;

    const maxCombo = getMaxCombo(beatmap);

    return { aimStrain, speedStrain, starRating, maxCombo };

    // Todo: These int casts are temporary to achieve 1:1 results with osu!stable, and should be removed in the future
    // double hitWindowGreat = (int)(beatmap.HitObjects.First().HitWindows.Great / 2) / clockRate;
    // double preempt = (int)BeatmapDifficulty.DifficultyRange(beatmap.BeatmapInfo.BaseDifficulty.ApproachRate, 1800, 1200, 450) / clockRate;

    // int maxCombo = beatmap.HitObjects.Count;
    // // Add the ticks + tail of the slider. 1 is subtracted because the head circle would be counted twice (once for the slider itself in the line above)
    // maxCombo += beatmap.HitObjects.OfType<Slider>().Sum(s => s.NestedHitObjects.Count - 1);

    // return new OsuDifficultyAttributes
    // {
    //     StarRating = starRating,
    //     Mods = mods,
    //     AimStrain = aimRating,
    //     SpeedStrain = speedRating,
    //     ApproachRate = preempt > 1200 ? (1800 - preempt) / 120 : (1200 - preempt) / 150 + 5,
    //     OverallDifficulty = (80 - hitWindowGreat) / 6,
    //     MaxCombo = maxCombo
    // };
}

function getMaxCombo(beatmap: ParsedBeatmap): number {
    let result = beatmap.hitObjects.length;

    for (const hitObject of beatmap.hitObjects) {
        if (isSlider(hitObject)) {
            result += hitObject.metadata.nestedHitObjects.length - 1;
        }
    }

    return result;
}
