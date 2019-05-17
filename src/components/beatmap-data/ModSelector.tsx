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

export const ModSelector: React.FC<ModSelectorProps> = props => {
    return (
        <div style={styles.container}>
            {difficultyReductionMods.map((mod, index) => (
                <Mod
                    key={index}
                    color='#50e250'
                    selected={props.selectedMods.has(mod)}
                    onClick={() => props.onModClick(mod)}
                >
                    {mod}
                </Mod>
            ))}

            {difficultyIncreaseMods.map((mod, index) => (
                <Mod
                    key={index}
                    color='#ff9090'
                    selected={props.selectedMods.has(mod)}
                    onClick={() => props.onModClick(mod)}
                >
                    {mod}
                </Mod>
            ))}
        </div>
    );
};
