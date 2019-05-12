import React from 'react';
import { Beatmap } from '../../types/Beatmap';
import { Stat } from '../base/stats/Stat';
import { StatGroup } from '../base/stats/StatGroup';
import { ComboColors } from './ComboColors';

export interface MiscStatsProps {
    beatmap: Beatmap;
}

export const MiscStats: React.FC<MiscStatsProps> = ({ beatmap }) => {
    return (
        <StatGroup>
            <Stat label='Beat Divisor'>
                {beatmap.beatDivisor}
            </Stat>

            <Stat label='Slider Multiplier'>
                {beatmap.sliderMultiplier}
            </Stat>

            <Stat label='Slider Tick Rate'>
                {beatmap.sliderTickRate}
            </Stat>

            <Stat label='Combo Colors'>
                {(beatmap.colors.length > 0)
                    ? <ComboColors beatmap={beatmap} />
                    : 'none'}
            </Stat>
        </StatGroup>
    );
};
