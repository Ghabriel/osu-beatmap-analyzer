import React, { useState } from 'react';
import './App.css';
import { quaver } from './beatmap-input.example';
import { Main } from './components/Main';
import { parseBeatmap } from './helpers/beatmap-parser';
import { Beatmap } from './types/Beatmap';

const App: React.FunctionComponent = () => {
    const [beatmapList, setBeatmapList] = useState<Beatmap[]>([]);
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(0);

    function handleImportBeatmap(beatmapString: string) {
        const beatmap = parseBeatmap(beatmapString);
        setBeatmapList(beatmapList.concat([beatmap]));
    }

    if (beatmapList.length === 0) {
        handleImportBeatmap(quaver);
    }

    return (
        <div className="page">
            <div className="header">
                osu! Beatmap Analyzer
            </div>

            <div className="body">
                {/* <div className="sidebar">
                    <Sidebar
                        beatmapList={beatmapList}
                        selectedBeatmap={selectedBeatmap}
                        onImportBeatmap={handleImportBeatmap}
                        onSelectBeatmap={beatmapIndex => setSelectedBeatmap(beatmapIndex)}
                    />
                </div> */}
                <div className="main">
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

export default App;
