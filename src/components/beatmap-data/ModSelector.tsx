import React from 'react';
import { StyleMap } from '../../types/StyleMap';
import { Mod } from './Mod';

export enum ModType {
    Easy = 'EZ',
    HalfTime = 'HT',
    Hidden = 'HD',
    HardRock = 'HR',
    DoubleTime = 'DT',
    Flashlight = 'FL',
}

export interface ModSelectorProps {
    selectedMods: Set<ModType>;
    onModClick: (mod: ModType) => void;
}

const styles: StyleMap = {
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
};

const difficultyReductionMods = [ModType.Easy, ModType.HalfTime];
const difficultyIncreaseMods = [ModType.Hidden, ModType.HardRock, ModType.DoubleTime, ModType.Flashlight];
const mutuallyExclusiveMods: [ModType, ModType][] = [
    [ModType.Easy, ModType.HardRock],
    [ModType.HalfTime, ModType.DoubleTime]
];

function getBlockedMods(selectedMods: Set<ModType>): Set<ModType> {
    const result = new Set<ModType>();

    for (const pair of mutuallyExclusiveMods) {
        if (selectedMods.has(pair[0])) {
            result.add(pair[1]);
        } else if (selectedMods.has(pair[1])) {
            result.add(pair[0]);
        }
    }

    return result;
}

export const ModSelector: React.FC<ModSelectorProps> = ({ selectedMods, onModClick }) => {
    const blockedMods = getBlockedMods(selectedMods);

    return (
        <div style={styles.container}>
            {difficultyReductionMods.map((mod, index) => (
                <Mod
                    key={index}
                    color='#50e250'
                    selected={selectedMods.has(mod)}
                    blocked={blockedMods.has(mod)}
                    onClick={() => onModClick(mod)}
                >
                    {mod}
                </Mod>
            ))}

            {difficultyIncreaseMods.map((mod, index) => (
                <Mod
                    key={index}
                    color='#ff9090'
                    selected={selectedMods.has(mod)}
                    blocked={blockedMods.has(mod)}
                    onClick={() => onModClick(mod)}
                >
                    {mod}
                </Mod>
            ))}
        </div>
    );
};
