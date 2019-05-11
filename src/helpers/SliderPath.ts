import { PathType } from '../types';
import { Point } from '../types/Point';
import { assertNever } from './assertNever';
import * as PathApproximator from './path-approximation';
import { getNorm, isSamePoint, operate, pointSubtract } from './point-arithmetic';

export class SliderPath {
    private calculatedPath: Point[] = [];
    private cumulativeLength: number[] = [];

    constructor(
        public pathType: PathType,
        public controlPoints: Point[],
        public length: number,
    ) {
        this.calculatePath();
        this.calculateCumulativeLength();
    }

    positionAt(progress: number): Point {
        const distance = this.progressToDistance(progress);
        const index = this.indexOfDistance(distance);
        return this.interpolateVertices(index, distance);
    }

    private progressToDistance(progress: number): number {
        return Math.max(0, Math.min(1, progress)) * this.length;
    }

    private indexOfDistance(distance: number): number {
        const index = this.cumulativeLength.findIndex(v => Math.abs(v - distance) < 1e-3);
        return (index < 0) ? ~index : index;
    }

    private interpolateVertices(index: number, distance: number): Point {
        if (this.calculatedPath.length === 0) {
            return { x: 0, y: 0 };
        }

        if (index <= 0) {
            return this.calculatedPath[0];
        }
        if (index >= this.calculatedPath.length) {
            return this.calculatedPath[this.calculatePath.length - 1];
        }

        const p0 = this.calculatedPath[index - 1];
        const p1 = this.calculatedPath[index];

        const d0 = this.cumulativeLength[index - 1];
        const d1 = this.cumulativeLength[index];

        if (Math.abs(d0 - d1) < 1e-3) {
            return p0;
        }

        const w = (distance - d0) / (d1 - d0);
        return operate(p1)
            .subtract(p0)
            .multiply(w)
            .sum(p0)
            .get();
    }

    private calculatePath() {
        let start = 0;

        for (let i = 0; i < this.controlPoints.length; i++) {
            const isLastPoint = i === this.controlPoints.length - 1;
            const currentPoint = this.controlPoints[i];
            const nextPoint = this.controlPoints[i + 1];

            if (isLastPoint || isSamePoint(currentPoint, nextPoint)) {
                const cpSpan = this.controlPoints.slice(start, i - start);

                for (const subPath of this.calculateSubpath(cpSpan)) {
                    const isFirstPath = this.calculatedPath.length === 0;
                    const lastPath = this.calculatedPath[this.calculatedPath.length - 1];

                    if (isFirstPath || !isSamePoint(lastPath, subPath)) {
                        this.calculatedPath.push(subPath);
                    }
                }

                start = i;
            }
        }
    }

    private calculateSubpath(subControlPoints: Point[]): Point[] {
        switch (this.pathType) {
            case PathType.Catmull:
                return PathApproximator.approximateCatmull(subControlPoints);

            case PathType.Bezier:
                return PathApproximator.approximateBezier(subControlPoints);

            case PathType.Linear:
                return subControlPoints;

            case PathType.PerfectCurve:
                if (this.controlPoints.length === 3 && subControlPoints.length === 3) {
                    const subPath = PathApproximator.approximateCircularArc(subControlPoints);

                    if (subPath !== null) {
                        return subPath;
                    }
                }

                return PathApproximator.approximateBezier(subControlPoints);

            default:
                return assertNever(this.pathType);
        }
    }

    private calculateCumulativeLength() {
        let l = 0;

        this.cumulativeLength.push(l);

        for (let i = 0; i < this.calculatedPath.length - 1; i++) {
            const diff = pointSubtract(this.calculatedPath[i + 1], this.calculatedPath[i]);
            let d = getNorm(diff);

            if (this.length - l < d) {
                this.calculatedPath[i + 1] = operate(diff)
                    .multiply((this.length - l) / d)
                    .sum(this.calculatedPath[i])
                    .get();
                this.calculatedPath.splice(i + 2, this.calculatedPath.length - 2 - i);

                l = this.length;
                this.cumulativeLength.push(l);
                break;
            }

            l += d;
            this.cumulativeLength.push(l);
        }

        if (l < this.length && this.calculatedPath.length > 1) {
            const diff = pointSubtract(
                this.calculatedPath[this.calculatedPath.length - 1],
                this.calculatedPath[this.calculatedPath.length - 2],
            );
            let d = getNorm(diff);

            // TODO: investigate
            if (d <= 0) {
                return;
            }

            // this.calculatedPath[this.calculatedPath.Count - 1] += diff * (float)((this.length - l) / d);
            this.calculatedPath[this.calculatedPath.length - 1] = operate(diff)
                .multiply((this.length - l) / d)
                .sum(this.calculatedPath[this.calculatedPath.length - 1])
                .get();
            this.cumulativeLength[this.calculatedPath.length - 1] = this.length;
        }
    }
}
