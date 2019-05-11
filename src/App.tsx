import React, { useState } from 'react';
import './App.css';
import { quaver } from './beatmap.example';
import { Main } from './components/Main';
import { parseBeatmap } from './helpers/beatmap-parser';
import { Beatmap } from './types/Beatmap';

const quaverCopy: Beatmap = {
    ...quaver,
    beatmapId: quaver.beatmapId + 1,
    title: 'quaver (mock copy)',
};

const quaverCopy2: Beatmap = {
    ...quaver,
    beatmapId: quaver.beatmapId + 2,
    title: 'quaver (mock copy 2)',
};

const App: React.FunctionComponent = () => {
    const [beatmapList, setBeatmapList] = useState<Beatmap[]>([quaver, quaverCopy, quaverCopy2]);
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(0);

    function handleImportBeatmap(beatmapString: string) {
        const beatmap = parseBeatmap(beatmapString);
        setBeatmapList(beatmapList.concat([beatmap]));
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
