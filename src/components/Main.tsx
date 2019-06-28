import React, { useState } from 'react';
import { changeBeatmapMods } from '../helpers/beatmap';
import { Beatmap } from '../types/Beatmap';
import { Mod as ModType } from '../types/Mod';
import { BasicStats } from './beatmap-data/BasicStats';
import { DifficultyStats } from './beatmap-data/DifficultyStats';
import { HitObjectStats } from './beatmap-data/HitObjectStats';
import { MiscStats } from './beatmap-data/MiscStats';
import { ModSelector } from './beatmap-data/ModSelector';
import './Main.scss';

export interface MainProps {
    beatmap: Beatmap | null;
    onBeatmapMutation: (beatmap: Beatmap) => void;
}

const mutuallyExclusiveMods: [ModType, ModType][] = [
    [ModType.Easy, ModType.HardRock],
    [ModType.HalfTime, ModType.DoubleTime]
];

function removeConflictingMods(selectedMods: Set<ModType>, mod: ModType) {
    for (const pair of mutuallyExclusiveMods) {
        if (pair[0] === mod) {
            selectedMods.delete(pair[1]);
        }

        if (pair[1] === mod) {
            selectedMods.delete(pair[0]);
        }
    }
}

export const Main: React.FC<MainProps> = ({ beatmap, onBeatmapMutation }) => {
    const [selectedMods, setSelectedMods] = useState(new Set<ModType>());

    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    function handleModClick(mod: ModType) {
        if (selectedMods.has(mod)) {
            selectedMods.delete(mod);
        } else {
            selectedMods.add(mod);
            removeConflictingMods(selectedMods, mod);
        }

        onBeatmapMutation(changeBeatmapMods(beatmap!, selectedMods));
        setSelectedMods(new Set(selectedMods));
    }

    return (
        <div className="main">
            <ModSelector selectedMods={selectedMods} onModClick={handleModClick} />
            <BasicStats beatmap={beatmap} />
            <DifficultyStats beatmap={beatmap} />
            <HitObjectStats beatmap={beatmap} />
            <MiscStats beatmap={beatmap} />
        </div>
    );
};
