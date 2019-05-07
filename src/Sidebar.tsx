import React from 'react';
import Button from 'react-bootstrap/Button';
import './Sidebar.css';

export const Sidebar: React.FunctionComponent = () => {
    return (
        <div className="component">
            <Button variant="primary">Import Beatmap</Button>
        </div>
    )
};
