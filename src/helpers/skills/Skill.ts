import { DifficultyHitObject } from '../../types';

export abstract class Skill {
    // The peak strain for each section of the beatmap.
    private strainPeaks: number[] = [];

    // Strain values are multiplied by this number for the given skill.
    // Used to balance the value of different skills between each other.
    protected abstract skillMultiplier: number;

    /// Determines how quickly strain decays for the given skill.
    /// For example a value of 0.15 indicates that strain decays to 15% of
    // its original value in one second.
    protected abstract strainDecayBase: number;

    // The weight by which each strain value decays.
    protected decayWeight: number = 0.9;

    // DifficultyHitObjects that were processed previously. They can
    // affect the strain values of the following objects.
    protected previous: DifficultyHitObject[] = [];

    // Strain level throughout the beatmap.
    private currentStrain = 1;
    // Peak strain level in the current section.
    private currentSectionPeak = 1;

    // Processes a DifficultyHitObject and update current strain values accordingly.
    process(current: DifficultyHitObject) {
        this.currentStrain *= this.strainDecay(current.deltaTime);
        this.currentStrain += this.strainValueOf(current) * this.skillMultiplier;

        this.currentSectionPeak = Math.max(this.currentStrain, this.currentSectionPeak);

        this.previous.push(current);
    }

    // Saves the current peak strain level to the list of strain peaks,
    // which will be used to calculate an overall difficulty.
    saveCurrentPeak() {
        if (this.previous.length > 0) {
            this.strainPeaks.push(this.currentSectionPeak);
        }
    }

    // Sets the initial strain level for a new section.
    startNewSectionFrom(offset: number) {
        if (this.previous.length > 0) {
            const previousObject = this.previous[this.previous.length - 1].current;
            const decayedStrain = this.strainDecay(offset - previousObject.startTime);
            this.currentSectionPeak = this.currentStrain * decayedStrain;
        }
    }

    // Returns the calculated difficulty value representing all processed
    // DifficultyHitObjects.
    difficultyValue(): number {
        this.strainPeaks.sort((a, b) => b - a);

        let difficulty = 0;
        let weight = 1;

        // Difficulty is the weighted sum of the highest strains from every section.
        for (const strain of this.strainPeaks) {
            difficulty += strain * weight;
            weight *= this.decayWeight;
        }

        return difficulty;
    }

    // Calculates the strain value of a DifficultyHitObject. This value is
    // affected by previously processed objects.
    protected abstract strainValueOf(current: DifficultyHitObject): number;

    private strainDecay(ms: number) {
        return Math.pow(this.strainDecayBase, ms / 1000);
    }
}
