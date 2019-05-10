import { Point } from '../types';

const BEZIER_TOLERANCE = 0.25;
const CATMULL_DETAIL = 50;
const CIRCULAR_ARC_TOLERANCE = 0.1;

export function approximateBezier(controlPoints: Point[]): Point[] {
    const output: Point[] = [];
    const count = controlPoints.length;

    if (count == 0) {
        return output;
    }

    const subdivisionBuffer1: Point[] = [];
    const subdivisionBuffer2: Point[] = [];

    const toFlatten: Point[][] = [];
    const freeBuffers: Point[][] = [];

    toFlatten.push(controlPoints);

    const leftChild = subdivisionBuffer2;

    while (toFlatten.length > 0) {
        const parent = toFlatten.pop()!;

        if (bezierIsFlatEnough(parent)) {
            bezierApproximate(parent, output, subdivisionBuffer1, subdivisionBuffer2, count);
            freeBuffers.push(parent);
            continue;
        }

        const rightChild = freeBuffers.length > 0 ? freeBuffers.pop()! : [];
        bezierSubdivide(parent, leftChild, rightChild, subdivisionBuffer1, count);

        for (let i = 0; i < count; i++) {
            parent[i] = leftChild[i];
        }

        toFlatten.push(rightChild);
        toFlatten.push(parent);
    }

    output.push(controlPoints[count - 1]);

    return output;
}

function bezierIsFlatEnough(controlPoints: Point[]): boolean {
    for (let i = 1; i < controlPoints.length - 1; i++) {
        const previous = controlPoints[i - 1];
        const current = controlPoints[i];
        const next = controlPoints[i + 1];

        const point = {
            x: previous.x - 2 * current.x + next.x,
            y: previous.y - 2 * current.y + next.y,
        };

        if ((point.x * point.x + point.y * point.y) > BEZIER_TOLERANCE * BEZIER_TOLERANCE * 4) {
            return false;
        }
    }

    return true;
}

function bezierSubdivide(
    controlPoints: Point[],
    left: Point[],
    right: Point[],
    subdivisionBuffer: Point[],
    count: number
) {
    const midpoints = subdivisionBuffer;

    for (let i = 0; i < count; i++) {
        midpoints[i] = controlPoints[i];
    }

    for (let i = 0; i < count; i++) {
        left[i] = midpoints[0];
        right[count - i - 1] = midpoints[count - i - 1];

        for (let j = 0; j < count - i - 1; j++) {
            midpoints[j] = {
                x: (midpoints[j].x + midpoints[j + 1].x) / 2,
                y: (midpoints[j].y + midpoints[j + 1].y) / 2,
            };
        }
    }
}

function bezierApproximate(
    controlPoints: Point[],
    output: Point[],
    subdivisionBuffer1: Point[],
    subdivisionBuffer2: Point[],
    count: number
) {
    const left = subdivisionBuffer2;
    const right = subdivisionBuffer1;

    bezierSubdivide(controlPoints, left, right, subdivisionBuffer1, count);

    for (let i = 0; i < count - 1; i++) {
        left[count + i] = right[i + 1];
    }

    output.push(controlPoints[0]);

    for (let i = 1; i < count - 1; i++) {
        const index = 2 * i;
        const previous = left[index - 1];
        const current = left[index];
        const next = left[index + 1];

        output.push({
            x: 0.25 * (previous.x + 2 * current.x + next.x),
            y: 0.25 * (previous.y + 2 * current.y + next.y),
        });
    }
}

export function approximateCatmull(controlPoints: Point[]): Point[] {
    const result: Point[] = [];

    for (let i = 0; i < controlPoints.length - 1; i++) {
        const v1 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
        const v2 = controlPoints[i];
        const v3 = i < controlPoints.length - 1 ? controlPoints[i + 1] : {
            x: 2 * v2.x - v1.x,
            y: 2 * v2.y - v1.y,
        };
        const v4 = i < controlPoints.length - 2 ? controlPoints[i + 2] : {
            x: 2 * v3.x - v2.x,
            y: 2 * v3.y - v2.y,
        };

        for (let c = 0; c < CATMULL_DETAIL; c++) {
            result.push(catmullFindPoint(v1, v2, v3, v4, c / CATMULL_DETAIL));
            result.push(catmullFindPoint(v1, v2, v3, v4, (c + 1) / CATMULL_DETAIL));
        }
    }

    return result;
}

function catmullFindPoint(vec1: Point, vec2: Point, vec3: Point, vec4: Point, t: number): Point {
    const t2 = t * t;
    const t3 = t * t2;

    const factor1 = {
        x: -vec1.x + vec3.x,
        y: -vec1.y + vec3.y,
    };

    const factor2 = {
        x: 2 * vec1.x - 5 * vec2.x + 4 * vec3.x - vec4.x,
        y: 2 * vec1.y - 5 * vec2.y + 4 * vec3.y - vec4.y,
    };

    const factor3 = {
        x: -vec1.x + 3 * vec2.x - 3 * vec3.x + vec4.x,
        y: -vec1.y + 3 * vec2.y - 3 * vec3.y + vec4.y,
    };

    return {
        x: 0.5 * (2 * vec2.x + factor1.x * t + factor2.x * t2 + factor3.x * t3),
        y: 0.5 * (2 * vec2.y + factor1.y * t + factor2.y * t2 + factor3.y * t3),
    };
}
