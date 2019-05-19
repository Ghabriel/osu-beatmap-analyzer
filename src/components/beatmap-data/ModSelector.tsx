import React from 'react';
import { createStyleSheet } from '../../helpers/utilities';
import { Mod as ModType } from '../../types/Mod';
import { Mod } from './Mod';

export interface ModSelectorProps {
    selectedMods: Set<ModType>;
    onModClick: (mod: ModType) => void;
}

const styles = createStyleSheet({
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
});

const difficultyReductionMods = [ModType.Easy, ModType.HalfTime];
const difficultyIncreaseMods = [ModType.HardRock, ModType.DoubleTime];

export const ModSelector: React.FC<ModSelectorProps> = ({ selectedMods, onModClick }) => {
    return (
        <div style={styles.container}>
            {difficultyReductionMods.map((mod, index) => (
                <Mod
                    key={index}
                    color='#50e250'
                    selected={selectedMods.has(mod)}
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
                    onClick={() => onModClick(mod)}
                >
                    {mod}
                </Mod>
            ))}
        </div>
    );
};
