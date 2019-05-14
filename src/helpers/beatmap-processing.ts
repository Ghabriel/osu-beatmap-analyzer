import { ParsedBeatmap } from "../types/Beatmap";
import { ControlPoint, ControlPointType, DifficultyControlPoint, EffectControlPoint, LegacySampleControlPoint, TimingControlPoint } from "../types/ControlPoint";
import { HitObject, HitObjectType, NestedHitObjectType, Slider } from "../types/HitObject";
import { Point } from "../types/Point";
import { TimingPoint } from "../types/TimingPoint";
import { assertNever } from "./assertNever";
import { fillBeatmapDefaults } from "./beatmap-fill-defaults";
import { PartialBeatmap } from "./parsing/PartialBeatmap";
import { pointSum } from "./point-arithmetic";
import { isCircle, isSlider, isSliderTip } from "./type-inference";

export interface SliderComputedProperties {
    startTime: number;
    spanCount: number;
    pathDistance: number;
    velocity: number;
    spanDuration: number;
    tickDistance: number;
}

export interface SliderEvent {
    type: SliderEventType;
    spanIndex: number;
    spanStartTime: number;
    time: number;
    pathProgress: number;
};

export enum SliderEventType {
    Head,
    Tick,
    Repeat,
    LegacyLastTick,
    Tail,
}

export function processBeatmap(partialBeatmap: PartialBeatmap): ParsedBeatmap {
    const beatmap = fillBeatmapDefaults(partialBeatmap);

    fillControlPoints(beatmap);

    fillHitObjectsComboInformation(beatmap);

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

    return beatmap;
}

function fillControlPoints(beatmap: ParsedBeatmap) {
    for (const timingPoint of beatmap.timingPoints) {
        if (timingPoint.timingChange) {
            beatmap.timingControlPoints.push(createTimingControlPoint(timingPoint));
        }

        beatmap.difficultyControlPoints.push(createDifficultyControlPoint(timingPoint));
        beatmap.effectControlPoints.push(createEffectControlPoint(timingPoint));
        beatmap.legacySampleControlPoints.push(createLegacySampleControlPoint(timingPoint));
    }
}

function createTimingControlPoint(timingPoint: TimingPoint): TimingControlPoint {
    return {
        type: ControlPointType.Timing,
        time: timingPoint.time,
        beatLength: timingPoint.beatLength,
        timeSignature: timingPoint.timeSignature,
    };
}

function createDifficultyControlPoint(timingPoint: TimingPoint): DifficultyControlPoint {
    return {
        type: ControlPointType.Difficulty,
        time: timingPoint.time,
        speedMultiplier: timingPoint.speedMultiplier,
    };
}

function createEffectControlPoint(timingPoint: TimingPoint): EffectControlPoint {
    return {
        type: ControlPointType.Effect,
        time: timingPoint.time,
        kiaiMode: timingPoint.kiaiMode,
        omitFirstBarSignature: timingPoint.omitFirstBarSignature,
    };
}

function createLegacySampleControlPoint(timingPoint: TimingPoint): LegacySampleControlPoint {
    return {
        type: ControlPointType.LegacySample,
        time: timingPoint.time,
        customSampleBank: timingPoint.customSampleBank,
        sampleSet: timingPoint.sampleSet,
        sampleVolume: timingPoint.sampleVolume,
    };
}

// TODO: find a better name
function fillHitObjectsComboInformation(beatmap: ParsedBeatmap) {
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

    const timingPoint = getTimingControlPoint(beatmap.timingControlPoints, slider.startTime);
    const difficultyPoint = getDifficultyControlPoint(beatmap.difficultyControlPoints, slider.startTime);
    const scoringDistance = BASE_SCORING_DISTANCE * beatmap.sliderMultiplier * difficultyPoint.speedMultiplier;

    slider.metadata.timingPoint = timingPoint;
    slider.metadata.difficultyPoint = difficultyPoint;
    slider.metadata.velocity = scoringDistance / timingPoint.beatLength;
    slider.metadata.tickDistance = scoringDistance / beatmap.sliderTickRate * TICK_DISTANCE_MULTIPLIER;
}

function getTimingControlPoint(
    list: TimingControlPoint[],
    startTime: number
): TimingControlPoint {
    const controlPoint = getControlPoint(list, startTime);

    if (controlPoint === null) {
        if (list.length > 0) {
            return list[0];
        }

        return {
            type: ControlPointType.Timing,
            time: 0,
            beatLength: 1000,
            timeSignature: 4,
        };
    }

    return controlPoint;
}

function getDifficultyControlPoint(
    list: DifficultyControlPoint[],
    startTime: number
): DifficultyControlPoint {
    const controlPoint = getControlPoint(list, startTime);

    if (controlPoint === null) {
        return {
            type: ControlPointType.Difficulty,
            time: 0,
            speedMultiplier: 1,
        };
    }

    return controlPoint;
}

function getControlPoint<T extends ControlPoint>(list: T[], startTime: number): T | null {
    const matches = list.filter(t => t.time <= startTime);

    return matches.length > 0
        ? matches[matches.length - 1]
        : null;
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

export function getHitObjectScale(beatmap: ParsedBeatmap): number {
    return 0.85 - 0.07 * beatmap.circleSize;
}

export function getSliderComputedProperties(slider: Slider): SliderComputedProperties {
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
