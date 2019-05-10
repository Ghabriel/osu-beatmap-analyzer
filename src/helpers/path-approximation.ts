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
        const last = controlPoints[i - 1];
        const current = controlPoints[i];
        const next = controlPoints[i + 1];

        const point = {
            x: last.x - 2 * current.x + next.x,
            y: last.y - 2 * current.y + next.y,
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
