import React from 'react';
import './App.css';
import { Sidebar } from './Sidebar';

const App: React.FunctionComponent = () => {
    function handleImportBeatmap(beatmap: string) {
        console.log('[BEATMAP]', beatmap);
    }

    return (
        <div className="page">
            <div className="header">
                osu! Beatmap Analyzer
            </div>

            <div className="body">
                <div className="sidebar">
                    <Sidebar onImportBeatmap={handleImportBeatmap} />
                </div>
                <div className="main">
                    Main
                </div>
            </div>
        </div>
    );
}

export default App;
