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

function operate(point: Point) {
    function pointSum(other: Point): Point {
        return {
            x: point.x + other.x,
            y: point.y + other.y,
        };
    }

    function pointSubtract(other: Point): Point {
        return {
            x: point.x - other.x,
            y: point.y - other.y,
        };
    }

    function pointMultiply(scalar: number): Point {
        return {
            x: scalar * point.x,
            y: scalar * point.y,
        };
    }

    function pointDivide(scalar: number): Point {
        return {
            x: point.x / scalar,
            y: point.y / scalar,
        };
    }

    return {
        sum: (other: Point) => operate(pointSum(other)),
        subtract: (other: Point) => operate(pointSubtract(other)),
        multiply: (scalar: number) => operate(pointMultiply(scalar)),
        divide: (scalar: number) => operate(pointDivide(scalar)),
        get: () => point,
    };
}

function getNorm(point: Point): number {
    return Math.sqrt(getSquaredNorm(point));
}

function getSquaredNorm(point: Point): number {
    return point.x * point.x + point.y * point.y;
}

function dotProduct(a: Point, b: Point): number {
    return a.x * b.x + a.y * b.y;
}

function getMidPoint(a: Point, b: Point): Point {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

function bezierIsFlatEnough(controlPoints: Point[]): boolean {
    for (let i = 1; i < controlPoints.length - 1; i++) {
        const previous = controlPoints[i - 1];
        const current = controlPoints[i];
        const next = controlPoints[i + 1];

        // point = previous - 2 * current + next
        const point = operate(previous)
            .subtract(
                operate(current).multiply(2).get()
            )
            .sum(next)
            .get();

        if (getSquaredNorm(point) > BEZIER_TOLERANCE * BEZIER_TOLERANCE * 4) {
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
            midpoints[j] = getMidPoint(midpoints[j], midpoints[j + 1]);
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

        // point = 0.25 * (previous + 2 * current + next)
        const point = operate(previous)
            .sum(
                operate(current).multiply(2).get()
            )
            .sum(next)
            .multiply(0.25)
            .get();

        output.push(point);
    }
}

export function approximateCatmull(controlPoints: Point[]): Point[] {
    const result: Point[] = [];

    for (let i = 0; i < controlPoints.length - 1; i++) {
        const v1 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
        const v2 = controlPoints[i];
        const v3 = (i < controlPoints.length - 1)
            ? controlPoints[i + 1]
            : operate(v2).multiply(2).subtract(v1).get();
        const v4 = (i < controlPoints.length - 2)
            ? controlPoints[i + 2]
            : operate(v3).multiply(2).subtract(v2).get();

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

    const factor1 = operate(vec1).multiply(-1).sum(vec3).get();

    const factor2 = operate(vec1).multiply(2)
        .subtract(operate(vec2).multiply(5).get())
        .sum(operate(vec3).multiply(4).get())
        .subtract(vec4)
        .get();

    const factor3 = operate(vec1).multiply(-1)
        .sum(operate(vec2).multiply(3).get())
        .subtract(operate(vec3).multiply(3).get())
        .sum(vec4)
        .get();

    return operate(vec2).multiply(2)
        .sum(operate(factor1).multiply(t).get())
        .sum(operate(factor2).multiply(t2).get())
        .sum(operate(factor3).multiply(t3).get())
        .multiply(0.5)
        .get();
}

export function approximateCircularArc(controlPoints: Point[]): Point[] | null {
    const [a, b, c] = controlPoints;

    const aSq = getSquaredNorm(operate(b).subtract(c).get());
    const bSq = getSquaredNorm(operate(a).subtract(c).get());
    const cSq = getSquaredNorm(operate(a).subtract(b).get());

    if (aSq < 1e-3 || bSq < 1e-3 || cSq < 1e-3) {
        return null;
    }

    const s = aSq * (bSq + cSq - aSq);
    const t = bSq * (aSq + cSq - bSq);
    const u = cSq * (aSq + bSq - cSq);

    const sum = s + t + u;

    if (sum < 1e-3) {
        return null;
    }

    const centre = operate(a).multiply(s)
        .sum(operate(b).multiply(t).get())
        .sum(operate(c).multiply(u).get())
        .divide(sum)
        .get();

    const dA = operate(a).subtract(centre).get();
    const dC = operate(c).subtract(centre).get();

    const r = getNorm(dA);

    const thetaStart = Math.atan2(dA.y, dA.x);
    let thetaEnd = Math.atan2(dC.y, dC.x);

    while (thetaEnd < thetaStart) {
        thetaEnd += 2 * Math.PI;
    }

    let dir = 1;
    let thetaRange = thetaEnd - thetaStart;

    let orthoAtoC = operate(c).subtract(a).get();
    orthoAtoC = {
        x: orthoAtoC.y,
        y: -orthoAtoC.x
    };

    if (dotProduct(orthoAtoC, operate(b).subtract(a).get()) < 0) {
        dir = -dir;
        thetaRange = 2 * Math.PI - thetaRange;
    }

    const amountPoints = (2 * r <= CIRCULAR_ARC_TOLERANCE)
        ? 2
        : Math.max(2, Math.ceil(thetaRange / (2 * Math.acos(1 - CIRCULAR_ARC_TOLERANCE / r))));

    const output: Point[] = [];

    for (let i = 0; i < amountPoints; i++) {
        const fract = i / (amountPoints - 1);
        const theta = thetaStart + dir * fract * thetaRange;
        const o = {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
        };
        output.push(operate(centre).sum(o).get());
    }

    return output;
}
