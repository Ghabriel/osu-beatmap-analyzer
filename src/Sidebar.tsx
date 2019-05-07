import React from 'react';
import Button from 'react-bootstrap/Button';
import { BeatmapSummary } from './components/BeatmapSummary';
import { useFileUpload } from './hooks/useFileUpload';
import './Sidebar.css';
import { Beatmap } from './types';

export interface SidebarProps {
    beatmapList: Beatmap[];
    onImportBeatmap: (beatmap: string) => void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    const handleClick = useFileUpload(props.onImportBeatmap);

    return (
        <div className="component">
            <Button variant="primary" onClick={handleClick}>
                Import Beatmap
            </Button>

            <div className="beatmap-list">
                {props.beatmapList.map(beatmap => (
                    <BeatmapSummary
                        key={beatmap.beatmapId}
                        beatmap={beatmap}
                    />
                ))}
            </div>
        </div>
    )
};
