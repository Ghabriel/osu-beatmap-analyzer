import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BeatmapSummary } from './components/BeatmapSummary';
import { useFileUpload } from './hooks/useFileUpload';
import './Sidebar.css';
import { Beatmap } from './types';

export interface SidebarProps {
    beatmapList: Beatmap[];
    onImportBeatmap: (beatmap: string) => void;
    onSelectBeatmap: (beatmap: Beatmap) => void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(null);

    const handleImportClick = useFileUpload(props.onImportBeatmap);

    function handleBeatmapClick(index: number) {
        setSelectedBeatmap(index);

        const beatmap = props.beatmapList[index];
        props.onSelectBeatmap(beatmap);
    }

    return (
        <div className="component">
            <Button variant="primary" onClick={handleImportClick}>
                Import Beatmap
            </Button>

            <div className="beatmap-list">
                {props.beatmapList.map((beatmap, index) => (
                    <BeatmapSummary
                        key={beatmap.beatmapId}
                        beatmap={beatmap}
                        isSelected={index === selectedBeatmap}
                        onClick={() => handleBeatmapClick(index)}
                    />
                ))}
            </div>
        </div>
    )
};
