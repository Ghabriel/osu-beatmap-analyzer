import React from 'react';
import { colors } from '../../helpers/style-variables';
import { merge } from '../../helpers/utilities';
import { StyleMap } from '../../types/StyleMap';

export enum Mod {
    Easy = 'EZ',
    HalfTime = 'HT',
    Hidden = 'HD',
    HardRock = 'HR',
    DoubleTime = 'DT',
    Flashlight = 'FL',
}

export interface ModSelectorProps {
    selectedMods: Set<Mod>;
    onModClick: (mod: Mod) => void;
}

const styles: StyleMap = {
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },

    mod: {
        alignItems: 'center',
        borderColor: colors.secondaryBorder,
        borderStyle: 'solid',
        borderRadius: '3px',
        borderWidth: '1px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        height: '40px',
        margin: '5px 5px',
        textAlign: 'center',
        width: '60px',
    },

    modText: {
        flex: '1 1',
    },

    selected: {
        borderWidth: '3px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },

    difficultyReduction: {
        backgroundColor: '#50e250',
    },

    difficultyIncrease: {
        backgroundColor: '#ff9090',
    },
};

const difficultyReductionMods = [Mod.Easy, Mod.HalfTime];
const difficultyIncreaseMods = [Mod.Hidden, Mod.HardRock, Mod.DoubleTime, Mod.Flashlight];

export const ModSelector: React.FC<ModSelectorProps> = props => {
    console.log(props);

    return (
        <div style={styles.container}>
            {difficultyReductionMods.map((mod, index) => (
                <div
                    key={index}
                    style={merge(
                        styles.mod,
                        styles.difficultyReduction,
                        props.selectedMods.has(mod) && styles.selected,
                    )}
                    onClick={() => props.onModClick(mod)}
                >
                    <div style={styles.modText}>
                        {mod}
                    </div>
                </div>
            ))}

            {difficultyIncreaseMods.map((mod, index) => (
                <div
                    key={index}
                    style={merge(
                        styles.mod,
                        styles.difficultyIncrease,
                        props.selectedMods.has(mod) && styles.selected,
                    )}
                    onClick={() => props.onModClick(mod)}
                >
                    <div style={styles.modText}>
                        {mod}
                    </div>
                </div>
            ))}
        </div>
    );
};
