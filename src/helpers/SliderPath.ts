import { PathType, Point } from '../types';
import { assertNever } from './assertNever';

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
                return PathApproximator.approximateLinear(subControlPoints);

            case PathType.PerfectCurve:
                if (this.controlPoints.length === 3 && subControlPoints.length === 3) {
                    const subPath = PathApproximator.approximateCircularArc(subControlPoints);

                    if (subPath.length !== 0) {
                        return subPath;
                    }
                }

                return PathApproximator.approximateBezier(subControlPoints);

            default:
                return assertNever(this.pathType);
        }
    }

    private calculateCumulativeLength() {
        throw new Error("Method not implemented.");
    }
}
