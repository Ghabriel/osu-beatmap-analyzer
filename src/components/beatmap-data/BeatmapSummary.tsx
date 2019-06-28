import React from 'react';
import { Beatmap } from '../../types/Beatmap';
import './BeatmapSummary.scss';

export interface BeatmapSummaryProps {
    beatmap: Beatmap;
    isSelected: boolean;
    onClick: () => void;
}

export const BeatmapSummary: React.FC<BeatmapSummaryProps> = props => {
    return (
        <div
            className={"beatmap-summary " + (props.isSelected ? 'selected' : '')}
            onClick={props.onClick}
        >
            {/* {beatmap.source} ({beatmap.artist}) - {beatmap.title} [{beatmap.version}] */}
            <div className="title">
                {props.beatmap.title}
            </div>

            <div className="author">
                {props.beatmap.artist} // {props.beatmap.creator}
            </div>

            <div className="version">
                {props.beatmap.version}
            </div>
        </div>
    );
};
