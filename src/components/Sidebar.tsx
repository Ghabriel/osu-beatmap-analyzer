import React from 'react';
import Button from 'react-bootstrap/Button';
import { useFileUpload } from '../hooks/useFileUpload';
import { Beatmap } from '../types/Beatmap';
import { StyleMap } from '../types/StyleMap';
import { BeatmapSummary } from './BeatmapSummary';

export interface SidebarProps {
    beatmapList: Beatmap[];
    selectedBeatmap: number | null;
    onImportBeatmap: (beatmapString: string) => void;
    onSelectBeatmap: (beatmapIndex: number) => void;
}

const styles: StyleMap = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
};

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    const handleImportClick = useFileUpload(props.onImportBeatmap);

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
                        isSelected={index === props.selectedBeatmap}
                        onClick={() => props.onSelectBeatmap(index)}
                    />
                ))}
            </div>
        </div>
    )
};
