import { PathType, Point } from '../types';
import { assertNever } from './assertNever';
import * as PathApproximator from './path-approximation';
import { getNorm, operate, pointSubtract } from './point-arithmetic';

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

    private calculatePath() {
        let start = 0;

        for (let i = 0; i < this.controlPoints.length; i++) {
            const isLastPoint = i === this.controlPoints.length - 1;
            const currentPoint = this.controlPoints[i];
            const nextPoint = this.controlPoints[i + 1];

            if (isLastPoint || this.isSamePoint(currentPoint, nextPoint)) {
                const cpSpan = this.controlPoints.slice(start, i - start);

                for (const subPath of this.calculateSubpath(cpSpan)) {
                    const isFirstPath = this.calculatedPath.length === 0;
                    const lastPath = this.calculatedPath[this.calculatedPath.length - 1];

                    if (isFirstPath || !this.isSamePoint(lastPath, subPath)) {
                        this.calculatedPath.push(subPath);
                    }
                }

                start = i;
            }
        }
    }

    private isSamePoint(a: Point, b: Point) {
        return a.x === b.x && a.y === b.y;
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
