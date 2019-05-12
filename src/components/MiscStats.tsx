import React from 'react';
import { propertyTableStyles } from '../styles/property-table';
import { Beatmap } from '../types/Beatmap';
import { BasicStat } from './BasicStat';
import { ComboColors } from './ComboColors';

export interface MiscStatsProps {
    beatmap: Beatmap;
}

export const MiscStats: React.FC<MiscStatsProps> = ({ beatmap }) => {
    return (
        <div style={propertyTableStyles.frame}>
            <BasicStat label='Beat Divisor' value={beatmap.beatDivisor} />
            <BasicStat label='Slider Multiplier' value={beatmap.sliderMultiplier} />
            <BasicStat label='Slider Tick Rate' value={beatmap.sliderTickRate} />
            <BasicStat
                label='Combo Colors'
                value={(beatmap.colors.length > 0)
                    ? <ComboColors beatmap={beatmap} />
                    : 'none'
                }
            />
        </div>
    );
};
