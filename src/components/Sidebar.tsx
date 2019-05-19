import React from 'react';
import Button from 'react-bootstrap/Button';
import { coalesce, createStyleSheet } from '../helpers/utilities';
import { useFileUpload } from '../hooks/useFileUpload';
import { Beatmap } from '../types/Beatmap';
import { BeatmapSummary } from './beatmap-data/BeatmapSummary';

export interface SidebarProps {
    beatmapList: Beatmap[];
    selectedBeatmap: number | null;
    onImportBeatmap: (beatmapString: string) => void;
    onSelectBeatmap: (beatmapIndex: number) => void;
}

const styles = createStyleSheet({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    }
});

export const Sidebar: React.FC<SidebarProps> = props => {
    const handleImportClick = useFileUpload(props.onImportBeatmap);

    return (
        <div style={styles.wrapper}>
            <Button variant="primary" onClick={handleImportClick}>
                Import Beatmap
            </Button>

            <div className="beatmap-list">
                {props.beatmapList.map((beatmap, index) => (
                    <BeatmapSummary
                        key={coalesce(beatmap.beatmapId, beatmap.title)}
                        beatmap={beatmap}
                        isSelected={index === props.selectedBeatmap}
                        onClick={() => props.onSelectBeatmap(index)}
                    />
                ))}
            </div>
        </div>
    )
};
