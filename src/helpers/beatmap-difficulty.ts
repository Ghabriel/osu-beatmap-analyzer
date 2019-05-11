import { Beatmap, Circle, ControlPoint, ControlPointType, DifficultyHitObject, HitObject, HitObjectType, NestedHitObject, NestedHitObjectType, ParsedBeatmap, Point, Slider, SliderCircle, SliderTailCircle, SliderTip, Spinner } from '../types';
import { assertNever } from './assertNever';
import { dotProduct, getNorm, operate, pointMultiply, pointNormalize, pointSubtract, pointSum } from './point-arithmetic';
import { Aim, Skill } from './skills/Aim';

// https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs
const SECTION_LENGTH = 400;

// https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Osu/Beatmaps/OsuBeatmapProcessor.cs#L14
const STACK_DISTANCE = 3;

// HitObject.cs (25)
const CONTROL_POINT_LENIENCY = 1;

// const CLOCK_RATE = 1000 / 30;
const CLOCK_RATE = 1;
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

    // TODO: do we need to apply defaults again?

    // TODO: apply mods, if any
    // https://github.com/ppy/osu/blob/master/osu.Game/Beatmaps/WorkingBeatmap.cs#L114

    postProcessBeatmap(beatmap);

    // TODO: apply mods, if any
    // https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/DifficultyCalculator.cs#L45

    fillStackedPositions(beatmap);

    const difficultyHitObjects = createDifficultyHitObjects(beatmap);

    calculate(difficultyHitObjects, beatmap);

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
            createNestedHitObjects(hitObject, beatmap);
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
    const matches = list.filter(t => t.time <= startTime);
    return matches[matches.length - 1];
}

interface SliderComputedProperties {
    startTime: number;
    spanCount: number;
    pathDistance: number;
    velocity: number;
    spanDuration: number;
    tickDistance: number;
}

interface SliderEvent {
    type: SliderEventType;
    spanIndex: number;
    spanStartTime: number;
    time: number;
    pathProgress: number;
};

enum SliderEventType {
    Head,
    Tick,
    Repeat,
    LegacyLastTick,
    Tail,
}

function createNestedHitObjects(slider: Slider, beatmap: ParsedBeatmap) {
    const computedProperties = getSliderComputedProperties(slider);
    const events = getSliderEvents(computedProperties);

    const { spanDuration } = computedProperties;
    const position: Point = {
        x: slider.x,
        y: slider.y,
    };
    const path = slider.metadata.path;

    for (const event of events) {
        switch (event.type) {
            case SliderEventType.Head:
                slider.metadata.nestedHitObjects.push({
                    type: NestedHitObjectType.SliderCircle,
                    startTime: event.time,
                    position: position,
                    indexInCurrentCombo: slider.indexInCurrentCombo,
                    comboIndex: slider.comboIndex,
                });
                break;

            case SliderEventType.Tick:
                slider.metadata.nestedHitObjects.push({
                    type: NestedHitObjectType.SliderTick,
                    spanIndex: event.spanIndex,
                    spanStartTime: event.spanStartTime,
                    startTime: event.time,
                    position: pointSum(position, path.positionAt(event.pathProgress)),
                    stackHeight: slider.metadata.stackHeight,
                    scale: getHitObjectScale(beatmap),
                });
                break;

            case SliderEventType.Repeat:
                slider.metadata.nestedHitObjects.push({
                    type: NestedHitObjectType.RepeatPoint,
                    repeatIndex: event.spanIndex,
                    spanDuration: spanDuration,
                    startTime: slider.startTime + (event.spanIndex + 1) * spanDuration,
                    position: pointSum(position, path.positionAt(event.pathProgress)),
                    stackHeight: slider.metadata.stackHeight,
                    scale: getHitObjectScale(beatmap),
                });
                break;

            case SliderEventType.LegacyLastTick:
                slider.metadata.nestedHitObjects.push({
                    type: NestedHitObjectType.SliderTailCircle,
                    startTime: event.time,
                    position: pointSum(position, path.positionAt(1)),
                    indexInCurrentCombo: slider.indexInCurrentCombo,
                    comboIndex: slider.comboIndex,
                });
                break;

            case SliderEventType.Tail:
                break;
        }
    }

    slider.metadata.nestedHitObjects.sort((a, b) => a.startTime - b.startTime);
}

function getHitObjectScale(beatmap: ParsedBeatmap): number {
    return 0.85 - 0.07 * beatmap.circleSize;
}

function getSliderComputedProperties(slider: Slider): SliderComputedProperties {
    const startTime = slider.startTime;
    const spanCount = slider.metadata.repeatCount + 1;
    const pathDistance = slider.metadata.path.length;
    const velocity = slider.metadata.velocity;
    const endTime = startTime + spanCount * pathDistance / velocity;
    const duration = endTime - startTime;
    const spanDuration = duration / spanCount;
    const tickDistance = slider.metadata.tickDistance;

    return {
        startTime,
        spanCount,
        pathDistance,
        velocity,
        spanDuration,
        tickDistance,
    };
}

// TODO: break this function into smaller ones
function getSliderEvents(sliderProperties: SliderComputedProperties): SliderEvent[] {
    const {
        startTime,
        spanCount,
        velocity,
        spanDuration,
    } = sliderProperties;

    const LEGACY_LAST_TICK_OFFSET = 36;

    // SliderEventGenerator.cs (23)
    const MAX_SLIDER_LENGTH = 100000;

    const length = Math.min(sliderProperties.pathDistance, MAX_SLIDER_LENGTH);
    const tickDistance = Math.max(0, Math.min(length, sliderProperties.tickDistance));
    const minDistanceFromEnd = velocity * 10;

    const result: SliderEvent[] = [];

    result.push({
        type: SliderEventType.Head,
        spanIndex: 0,
        spanStartTime: startTime,
        time: startTime,
        pathProgress: 0,
    });

    if (tickDistance !== 0) {
        for (let span = 0; span < spanCount; span++) {
            const spanStartTime = startTime + span * spanDuration;
            const reversed = span % 2 === 1;

            for (let d = tickDistance; d <= length; d += tickDistance) {
                if (d >= length - minDistanceFromEnd) {
                    break;
                }

                const pathProgress = d / length;
                const timeProgress = reversed ? 1 - pathProgress : pathProgress;

                result.push({
                    type: SliderEventType.Tick,
                    spanIndex: span,
                    spanStartTime: spanStartTime,
                    time: spanStartTime + timeProgress * spanDuration,
                    pathProgress: pathProgress,
                })
            }

            if (span < spanCount - 1) {
                result.push({
                    type: SliderEventType.Repeat,
                    spanIndex: span,
                    spanStartTime: startTime + span * spanDuration,
                    time: spanStartTime + spanDuration,
                    pathProgress: (span + 1) % 2,
                });
            }
        }
    }

    const totalDuration = spanCount * spanDuration;

    const finalSpanIndex = spanCount - 1;
    const finalSpanStartTime = startTime + finalSpanIndex * spanDuration;
    const finalSpanEndTime = Math.max(
        startTime + totalDuration / 2,
        (finalSpanStartTime + spanDuration) - LEGACY_LAST_TICK_OFFSET
    );
    let finalProgress = (finalSpanEndTime - finalSpanStartTime) / spanDuration;

    if (spanCount % 2 === 0) {
        finalProgress = 1 - finalProgress;
    }

    result.push({
        type: SliderEventType.LegacyLastTick,
        spanIndex: finalSpanIndex,
        spanStartTime: finalSpanStartTime,
        time: finalSpanEndTime,
        pathProgress: finalProgress,
    });

    result.push({
        type: SliderEventType.Tail,
        spanIndex: finalSpanIndex,
        spanStartTime: startTime + (spanCount - 1) * spanDuration,
        time: startTime + totalDuration,
        pathProgress: spanCount % 2,
    });

    return result;
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
    // for (const hitObject of beatmap.hitObjects) {
    //     if (isSlider(hitObject)) {
    //         for (const nested of hitObject.metadata.nestedHitObjects) {
    //             if (isSliderTip(nested)) {
    //                 nested.comboIndex = hitObject.comboIndex;
    //                 nested.indexInCurrentCombo = hitObject.indexInCurrentCombo;
    //             }
    //         }
    //     }
    // }

    beatmap.hitObjects.filter(isSlider).map(slider => {
        slider.metadata.nestedHitObjects.filter(isSliderTip).map(nested => {
            nested.comboIndex = slider.comboIndex;
            nested.indexInCurrentCombo = slider.indexInCurrentCombo;
        });
    });
}

function isCircle(hitObject: HitObject): hitObject is Circle {
    return hitObject.type === HitObjectType.Circle;
}

function isSlider(hitObject: HitObject): hitObject is Slider {
    return hitObject.type === HitObjectType.Slider;
}

function isSliderTip(hitObject: NestedHitObject): hitObject is SliderTip {
    return isSliderCircle(hitObject) || isSliderTailCircle(hitObject);
}

function isSliderCircle(hitObject: NestedHitObject): hitObject is SliderCircle {
    return hitObject.type === NestedHitObjectType.SliderCircle;
}

function isSliderTailCircle(hitObject: NestedHitObject): hitObject is SliderTailCircle {
    return hitObject.type === NestedHitObjectType.SliderTailCircle;
}

function isSpinner(hitObject: HitObject): hitObject is Spinner {
    return hitObject.type === HitObjectType.Spinner;
}

function fillStackedPositions(beatmap: ParsedBeatmap) {
    const hitObjectScale = getHitObjectScale(beatmap);

    for (const hitObject of beatmap.hitObjects) {
        const stackHeight = (isCircle(hitObject) || isSlider(hitObject))
            ? hitObject.metadata.stackHeight
            : 0;

        const stackOffset = stackHeight * hitObjectScale * -6.4;

        hitObject.metadata.stackedPosition = {
            x: hitObject.x + stackOffset,
            y: hitObject.y + stackOffset,
        };
    }
}

function createDifficultyHitObjects(beatmap: ParsedBeatmap): DifficultyHitObject[] {
    const hitObjectScale = getHitObjectScale(beatmap);
    const hitObjectRadius = getHitObjectRadius(hitObjectScale);
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

function getHitObjectRadius(hitObjectScale: number): number {
    return OBJECT_RADIUS * hitObjectScale;
}

function getScalingFactor(hitObjectRadius: number): number {
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
    const scale = getHitObjectScale(beatmap);
    let lazyEndPosition = slider.metadata.stackedPosition;
    let lazyTravelDistance = 0;

    const approxFollowCircleRadius = getHitObjectRadius(scale) * 3;
    const computedProperties = getSliderComputedProperties(slider);

    slider.metadata.nestedHitObjects.slice(1).map(nested => {
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

function calculate(difficultyHitObjects: DifficultyHitObject[], beatmap: ParsedBeatmap) {
    const BASE_SECTION_LENGTH = 400;
    const sectionLength = BASE_SECTION_LENGTH * CLOCK_RATE;

    let currentSectionEnd = Math.ceil(beatmap.hitObjects[0].startTime / sectionLength) * sectionLength;

   const skills: Skill[] = [new Aim()];

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

    // return CreateDifficultyAttributes(beatmap, mods, skills, clockRate);
}
