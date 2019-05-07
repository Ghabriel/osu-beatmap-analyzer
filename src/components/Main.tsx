import React from 'react';
import { Beatmap } from '../types';

export interface MainProps {
    beatmap: Beatmap | null;
}

export const Main: React.FunctionComponent<MainProps> = ({ beatmap }) => {
    if (beatmap === null) {
        return (
            <div>
                Import/Select a beatmap in the sidebar to analyze it.
            </div>
        );
    }

    return (
        <div>
            Main Test ({ beatmap.beatmapId })
        </div>
    );
};
