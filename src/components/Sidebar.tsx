import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useFileUpload } from '../hooks/useFileUpload';
import { Beatmap, StyleMap } from '../types';
import { BeatmapSummary } from './BeatmapSummary';

export interface SidebarProps {
    beatmapList: Beatmap[];
    onImportBeatmap: (beatmap: string) => void;
    onSelectBeatmap: (beatmap: Beatmap) => void;
}

const styles: StyleMap = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
};

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(null);

    const handleImportClick = useFileUpload(props.onImportBeatmap);

    function handleBeatmapClick(index: number) {
        setSelectedBeatmap(index);

        const beatmap = props.beatmapList[index];
        props.onSelectBeatmap(beatmap);
    }

    return (
        <div style={styles.wrapper}>
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
