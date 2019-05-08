import { PathType, Point } from '../types';

export class SliderPath {
    constructor(
        private pathType: PathType,
        private controlPoints: Point[],
        private length: number,
    ) { }
}
