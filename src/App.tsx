import React, { useState } from 'react';
import './App.scss';
import { quaver } from './beatmap-mocks/quaver.beatmap';
import { Main } from './components/Main';
import { Sidebar } from './components/Sidebar';
import { readBeatmapFromString } from './helpers/beatmap';
import { Beatmap } from './types/Beatmap';

export const App: React.FC = () => {
    const [beatmapList, setBeatmapList] = useState<Beatmap[]>([]);
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(0);

    function handleImportBeatmap(beatmapString: string) {
        const beatmap = readBeatmapFromString(beatmapString);
        setBeatmapList(beatmapList.concat([beatmap]));
    }

    function handleBeatmapMutation(beatmap: Beatmap) {
        if (selectedBeatmap !== null) {
            beatmapList[selectedBeatmap] = beatmap;
            setBeatmapList([...beatmapList]);
        }
    }

    if (beatmapList.length === 0) {
        handleImportBeatmap(quaver);
    }

    return (
        <div className="page">
            <header>
                osu! Beatmap Analyzer
            </header>

            <aside>
                <Sidebar
                    beatmapList={beatmapList}
                    selectedBeatmap={selectedBeatmap}
                    onImportBeatmap={handleImportBeatmap}
                    onSelectBeatmap={beatmapIndex => setSelectedBeatmap(beatmapIndex)}
                />
            </aside>

            <main>
                <Main
                    beatmap={
                        selectedBeatmap === null
                            ? null
                            : beatmapList[selectedBeatmap]
                    }
                    onBeatmapMutation={handleBeatmapMutation}
                />
            </main>
        </div>
    );
}
