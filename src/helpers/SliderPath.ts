import { PathType, Point } from '../types';

export class SliderPath {
    constructor(
        public pathType: PathType,
        public controlPoints: Point[],
        public length: number,
    ) { }
}
