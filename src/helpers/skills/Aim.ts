import { DifficultyHitObject } from "../../types";

export interface Skill {
    saveCurrentPeak(): void;
    startNewSectionFrom(value: number): void;
    process(difficultyHitObject: DifficultyHitObject): void;
}

export class Aim implements Skill {
    saveCurrentPeak(): void {
        // TODO
    }

    startNewSectionFrom(value: number): void {
        // TODO
    }

    process(difficultyHitObject: DifficultyHitObject): void {
        // TODO
    }
}
