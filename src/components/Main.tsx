import React, { useState } from 'react';
import { changeBeatmapMods } from '../helpers/beatmap';
import { Beatmap } from '../types/Beatmap';
import { Mod as ModType } from '../types/Mod';
import { StyleMap } from '../types/StyleMap';
import { DifficultyStats } from './beatmap-data/DifficultyStats';
import { HitObjectStats } from './beatmap-data/HitObjectStats';
import { MiscStats } from './beatmap-data/MiscStats';
import { ModSelector } from './beatmap-data/ModSelector';

export interface MainProps {
    beatmap: Beatmap | null;
    onBeatmapMutation: (beatmap: Beatmap) => void;
}

const styles: StyleMap = {
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
    },

    version: {
        fontWeight: 'bold',
    },

    author: {
        fontSize: '1.1rem',
    },
};

export const Main: React.FC<MainProps> = ({ beatmap, onBeatmapMutation }) => {
    const [selectedMods, setSelectedMods] = useState(new Set<ModType>());

    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    const artist = beatmap.artist;

    function handleModClick(mod: ModType) {
        if (selectedMods.has(mod)) {
            selectedMods.delete(mod);
        } else {
            selectedMods.add(mod);
        }

        onBeatmapMutation(changeBeatmapMods(beatmap!, selectedMods));
        setSelectedMods(new Set(selectedMods));
    }

    return (
        <div>
            <ModSelector selectedMods={selectedMods} onModClick={handleModClick} />

            <div style={styles.title}>
                {beatmap.title}
            </div>

            <div style={styles.version}>
                {beatmap.version}
            </div>

            <div style={styles.author}>
                {beatmap.source} {artist ? `(${artist})` : ''} - Mapped by {beatmap.creator}
            </div>

            <DifficultyStats beatmap={beatmap} />
            <HitObjectStats beatmap={beatmap} />
            <MiscStats beatmap={beatmap} />
        </div>
    );
};
