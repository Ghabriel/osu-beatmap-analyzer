import { Point } from '../types';

export function pointSum(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

export function pointSubtract(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

export function pointMultiply(point: Point, scalar: number): Point {
    return {
        x: point.x * scalar,
        y: point.y * scalar,
    };
}

export function pointDivide(point: Point, scalar: number): Point {
    return {
        x: point.x / scalar,
        y: point.y / scalar,
    };
}

export function operate(point: Point) {
    return {
        sum: (other: Point) => operate(pointSum(point, other)),
        subtract: (other: Point) => operate(pointSubtract(point, other)),
        multiply: (scalar: number) => operate(pointMultiply(point, scalar)),
        divide: (scalar: number) => operate(pointDivide(point, scalar)),
        get: () => point,
    };
}

export function getNorm(point: Point): number {
    return Math.sqrt(getSquaredNorm(point));
}

export function getSquaredNorm(point: Point): number {
    return point.x * point.x + point.y * point.y;
}

export function dotProduct(a: Point, b: Point): number {
    return a.x * b.x + a.y * b.y;
}

export function getMidPoint(a: Point, b: Point): Point {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

export function isSamePoint(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
}

export function pointNormalize(point: Point) {
    const norm = getNorm(point);
    point.x /= norm;
    point.y /= norm;
}
