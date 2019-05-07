import React from 'react';
import './App.css';
import { Sidebar } from './Sidebar';

const App: React.FunctionComponent = () => {
    return (
        <div className="page">
            <div className="header">
                osu! Beatmap Analyzer
            </div>

            <div className="body">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main">
                    Main
                </div>
            </div>
        </div>
    );
}

export default App;
