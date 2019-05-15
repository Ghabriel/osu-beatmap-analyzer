import { ParsedBeatmap } from "../types/Beatmap";
import { ControlPoint, ControlPointType, DifficultyControlPoint, EffectControlPoint, LegacySampleControlPoint, TimingControlPoint } from "../types/ControlPoint";
import { HitObjectType, NestedHitObject, NestedHitObjectType, RepeatPoint, Slider, SliderCircle, SliderTailCircle, SliderTick } from "../types/HitObject";
import { TimingPoint } from "../types/TimingPoint";
import { assertNever } from "./assertNever";
import { fillBeatmapDefaults } from "./beatmap-fill-defaults";
import { PartialBeatmap } from "./parsing/PartialBeatmap";
import { pointSum } from "./point-arithmetic";
import { isCircle, isSlider, isSliderTip } from "./type-inference";
import { clamp, isNotNull, sortBy } from "./utilities";

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

    fillHitObjectsComboData(beatmap);

    fillSliderData(beatmap);

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

function fillHitObjectsComboData(beatmap: ParsedBeatmap) {
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

function fillSliderData(beatmap: ParsedBeatmap) {
    beatmap.hitObjects.filter(isSlider).forEach(slider => {
        fillSliderMetadata(slider, beatmap);
        fillNestedHitObjects(slider, beatmap);
    });
}

function fillSliderMetadata(slider: Slider, beatmap: ParsedBeatmap) {
    const BASE_SCORING_DISTANCE = 100;
    const TICK_DISTANCE_MULTIPLIER = 1;

    const { timingControlPoints, difficultyControlPoints, sliderMultiplier } = beatmap;
    const timingPoint = getTimingControlPoint(timingControlPoints, slider.startTime);
    const difficultyPoint = getDifficultyControlPoint(difficultyControlPoints, slider.startTime);
    const scoringDistance = BASE_SCORING_DISTANCE * sliderMultiplier * difficultyPoint.speedMultiplier;

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

function fillNestedHitObjects(slider: Slider, beatmap: ParsedBeatmap) {
    const computedProperties = getSliderComputedProperties(slider);

    getSliderEvents(computedProperties)
        .map(event => createNestedHitObject(slider, event, computedProperties, beatmap))
        .filter(isNotNull)
        .forEach(h => slider.metadata.nestedHitObjects.push(h));

    sortBy(slider.metadata.nestedHitObjects, 'startTime');
}

function createNestedHitObject(
    slider: Slider,
    event: SliderEvent,
    computedProperties: SliderComputedProperties,
    beatmap: ParsedBeatmap,
): NestedHitObject | null {
    switch (event.type) {
        case SliderEventType.Head:
            return createSliderCircle(slider, event);

        case SliderEventType.Tick:
            return createSliderTick(slider, event, beatmap);

        case SliderEventType.Repeat:
            return createRepeatPoint(slider, event, computedProperties, beatmap);

        case SliderEventType.LegacyLastTick:
            return createSliderTailCircle(slider, event);

        case SliderEventType.Tail:
            return null;

        default:
            return assertNever(event.type);
    }
}

function createSliderCircle(slider: Slider, event: SliderEvent): SliderCircle {
    const position = { x: slider.x, y: slider.y };

    return {
        type: NestedHitObjectType.SliderCircle,
        startTime: event.time,
        position: position,
        indexInCurrentCombo: slider.indexInCurrentCombo,
        comboIndex: slider.comboIndex,
    };
}

function createSliderTick(slider: Slider, event: SliderEvent, beatmap: ParsedBeatmap): SliderTick {
    const position = { x: slider.x, y: slider.y };
    const path = slider.metadata.path;

    return {
        type: NestedHitObjectType.SliderTick,
        spanIndex: event.spanIndex,
        spanStartTime: event.spanStartTime,
        startTime: event.time,
        position: pointSum(position, path.positionAt(event.pathProgress)),
        stackHeight: slider.metadata.stackHeight,
        scale: getHitObjectScale(beatmap),
    };
}

function createRepeatPoint(
    slider: Slider,
    event: SliderEvent,
    computedProperties: SliderComputedProperties,
    beatmap: ParsedBeatmap,
): RepeatPoint {
    const spanDuration = computedProperties.spanDuration;
    const position = { x: slider.x, y: slider.y };
    const path = slider.metadata.path;

    return {
        type: NestedHitObjectType.RepeatPoint,
        repeatIndex: event.spanIndex,
        spanDuration: spanDuration,
        startTime: slider.startTime + (event.spanIndex + 1) * spanDuration,
        position: pointSum(position, path.positionAt(event.pathProgress)),
        stackHeight: slider.metadata.stackHeight,
        scale: getHitObjectScale(beatmap),
    };
}

function createSliderTailCircle(slider: Slider, event: SliderEvent): SliderTailCircle {
    const position = { x: slider.x, y: slider.y };
    const path = slider.metadata.path;

    return {
        type: NestedHitObjectType.SliderTailCircle,
        startTime: event.time,
        position: pointSum(position, path.positionAt(1)),
        indexInCurrentCombo: slider.indexInCurrentCombo,
        comboIndex: slider.comboIndex,
    };
}

export function getHitObjectScale(beatmap: ParsedBeatmap): number {
    return 0.85 - 0.07 * beatmap.circleSize;
}

export function getSliderComputedProperties(slider: Slider): SliderComputedProperties {
    // SliderEventGenerator.cs (23)
    const MAX_SLIDER_LENGTH = 100000;

    const startTime = slider.startTime;
    const spanCount = slider.metadata.repeatCount + 1;
    const pathDistance = Math.min(slider.metadata.path.length, MAX_SLIDER_LENGTH);
    const velocity = slider.metadata.velocity;
    const endTime = startTime + spanCount * pathDistance / velocity;
    const duration = endTime - startTime;
    const spanDuration = duration / spanCount;
    const tickDistance = clamp(slider.metadata.tickDistance, 0, pathDistance);

    return {
        startTime,
        spanCount,
        pathDistance,
        velocity,
        spanDuration,
        tickDistance,
    };
}

function getSliderEvents(sliderProperties: SliderComputedProperties): SliderEvent[] {
    const result: SliderEvent[] = [];

    result.push(createSliderEventHead(sliderProperties));

    if (sliderProperties.tickDistance !== 0) {
        const spanCount = sliderProperties.spanCount;

        for (let span = 0; span < spanCount - 1; span++) {
            result.push(...createSliderEventTicks(sliderProperties, span));
            result.push(createSliderEventRepeat(sliderProperties, span));
        }

        result.push(...createSliderEventTicks(sliderProperties, spanCount - 1));
    }

    result.push(createSliderEventLegacyLastTick(sliderProperties));
    result.push(createSliderEventTail(sliderProperties));

    return result;
}

function createSliderEventHead(sliderProperties: SliderComputedProperties): SliderEvent {
    return {
        type: SliderEventType.Head,
        spanIndex: 0,
        spanStartTime: sliderProperties.startTime,
        time: sliderProperties.startTime,
        pathProgress: 0,
    };
}

function createSliderEventTicks(
    sliderProperties: SliderComputedProperties,
    span: number,
): SliderEvent[] {
    const { startTime, velocity, tickDistance, spanDuration, pathDistance } = sliderProperties;
    const minDistanceFromEnd = velocity * 10;
    const spanStartTime = startTime + span * spanDuration;
    const reversed = span % 2 === 1;
    const result: SliderEvent[] = [];

    for (let d = tickDistance; d < pathDistance - minDistanceFromEnd; d += tickDistance) {
        const pathProgress = d / pathDistance;
        const timeProgress = reversed ? 1 - pathProgress : pathProgress;

        result.push({
            type: SliderEventType.Tick,
            spanIndex: span,
            spanStartTime: spanStartTime,
            time: spanStartTime + timeProgress * spanDuration,
            pathProgress: pathProgress,
        });
    }

    return result;
}

function createSliderEventRepeat(
    sliderProperties: SliderComputedProperties,
    span: number,
): SliderEvent {
    const { startTime, spanDuration } = sliderProperties;
    const spanStartTime = startTime + span * spanDuration;

    return {
        type: SliderEventType.Repeat,
        spanIndex: span,
        spanStartTime: spanStartTime,
        time: spanStartTime + spanDuration,
        pathProgress: (span + 1) % 2,
    };
}

function createSliderEventLegacyLastTick(sliderProperties: SliderComputedProperties): SliderEvent {
    const LEGACY_LAST_TICK_OFFSET = 36;

    const { startTime, spanCount, spanDuration } = sliderProperties;
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

    return {
        type: SliderEventType.LegacyLastTick,
        spanIndex: finalSpanIndex,
        spanStartTime: finalSpanStartTime,
        time: finalSpanEndTime,
        pathProgress: finalProgress,
    };
}

function createSliderEventTail(sliderProperties: SliderComputedProperties): SliderEvent {
    const { startTime, spanCount, spanDuration } = sliderProperties;
    const finalSpanIndex = spanCount - 1;
    const totalDuration = spanCount * spanDuration;

    return {
        type: SliderEventType.Tail,
        spanIndex: finalSpanIndex,
        spanStartTime: startTime + finalSpanIndex * spanDuration,
        time: startTime + totalDuration,
        pathProgress: spanCount % 2,
    };
}

function preProcessBeatmap(beatmap: ParsedBeatmap) {
    const [first, ...rest] = beatmap.hitObjects;

    if (first.newCombo) {
        first.indexInCurrentCombo = 0;
        first.comboIndex = first.comboOffset + 1;
    }

    let lastObject = first;

    for (const hitObject of rest) {
        if (hitObject.newCombo) {
            hitObject.indexInCurrentCombo = 0;
            hitObject.comboIndex = lastObject.comboIndex + hitObject.comboOffset + 1;
            lastObject.lastInCombo = true;
        } else {
            hitObject.indexInCurrentCombo = lastObject.indexInCurrentCombo + 1;
            hitObject.comboIndex = lastObject.comboIndex;
        }

        lastObject = hitObject;
    }
}

function postProcessBeatmap(beatmap: ParsedBeatmap) {
    beatmap.hitObjects.filter(isSlider).forEach(slider => {
        slider.metadata.nestedHitObjects.filter(isSliderTip).forEach(nested => {
            nested.comboIndex = slider.comboIndex;
            nested.indexInCurrentCombo = slider.indexInCurrentCombo;
        });
    });

    // TODO: apply stacking
    // https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Osu/Beatmaps/OsuBeatmapProcessor.cs#L14
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
