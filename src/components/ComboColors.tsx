import React from 'react';
import { Beatmap } from '../types/Beatmap';
import { HitObject } from './HitObject';

export interface ComboColorsProps {
    beatmap: Beatmap;
}

export const ComboColors: React.FunctionComponent<ComboColorsProps> = ({ beatmap }) => {
    return (
        <>
            {beatmap.colors.map((color, index) => (
                <HitObject key={index} backgroundColor={color} />
            ))}
        </>
    )
};
