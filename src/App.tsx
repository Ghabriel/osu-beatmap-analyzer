import React, { useState } from 'react';
import { quaver } from './beatmap-input.example';
import { Main } from './components/Main';
import { Sidebar } from './components/Sidebar';
import { readBeatmapFromString } from './helpers/beatmap';
import { colors } from './helpers/style-variables';
import { Beatmap } from './types/Beatmap';
import { StyleMap } from './types/StyleMap';

const styles: StyleMap = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
    },

    header: {
        backgroundColor: colors.primaryDark,
        color: 'white',
        flex: '0 0 auto',
        fontSize: '20px',
        padding: '3px',
    },

    body: {
        display: 'flex',
        flexDirection: 'row',
        flex: '1 1',
    },

    sidebar: {
        backgroundColor: '#ccc',
        borderRight: `1px solid ${colors.secondary}`,
        flex: '20 0 20%',
        padding: '3px',
    },

    main: {
        backgroundColor: '#eee',
        flex: '80 0 80%',
        padding: '0 5px',
    }
};

export const App: React.FC = () => {
    const [beatmapList, setBeatmapList] = useState<Beatmap[]>([]);
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(0);

    function handleImportBeatmap(beatmapString: string) {
        const beatmap = readBeatmapFromString(beatmapString);
        setBeatmapList(beatmapList.concat([beatmap]));
    }

    if (beatmapList.length === 0) {
        handleImportBeatmap(quaver);
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                osu! Beatmap Analyzer
            </div>

            <div style={styles.body}>
                <div style={styles.sidebar}>
                    <Sidebar
                        beatmapList={beatmapList}
                        selectedBeatmap={selectedBeatmap}
                        onImportBeatmap={handleImportBeatmap}
                        onSelectBeatmap={beatmapIndex => setSelectedBeatmap(beatmapIndex)}
                    />
                </div>
                <div style={styles.main}>
                    <Main
                        beatmap={
                            selectedBeatmap === null
                                ? null
                                : beatmapList[selectedBeatmap]
                        }
                    />
                </div>
            </div>
        </div>
    );
}
