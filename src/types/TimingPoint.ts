export interface TimingPoint {
    time: number;
    beatLength: number;
    timeSignature: number; // unused
    sampleSet: number; // unused
    customSampleBank: number; // unused
    sampleVolume: number; // unused
    timingChange: boolean;
    kiaiMode: boolean; // unused
    omitFirstBarSignature: boolean; // unused

    // Computed
    speedMultiplier: number;
}
