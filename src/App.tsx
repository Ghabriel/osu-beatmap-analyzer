import React from 'react';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="page">
            <div className="header">
                Header
            </div>

            <div className="body">
                <div className="sidebar">
                    Sidebar
                </div>
                <div className="main">
                    Main
                </div>
            </div>
        </div>
    );
}

export default App;
