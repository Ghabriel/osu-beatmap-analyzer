import React from 'react';
import { Beatmap } from '../../types/Beatmap';

export interface BasicStatsProps {
    beatmap: Beatmap;
}

export const BasicStats: React.FC<BasicStatsProps> = ({ beatmap }) => {
    const artist = beatmap.artist;

    return (
        <div className="basic-stats">
            <div className="title">
                {beatmap.title}
            </div>

            <div className="version">
                {beatmap.version}
            </div>

            <div className="author">
                {beatmap.source}{artist ? ` (${artist})` : ''} - Mapped by {beatmap.creator}
            </div>
        </div>
    );
};
