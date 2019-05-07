import React from 'react';
import Button from 'react-bootstrap/Button';
import { useFileUpload } from './hooks/useFileUpload';
import './Sidebar.css';

export interface SidebarProps {
    onImportBeatmap: (beatmap: string) => void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    const handleClick = useFileUpload(props.onImportBeatmap);

    return (
        <div className="component">
            <Button variant="primary" onClick={handleClick}>
                Import Beatmap
            </Button>
        </div>
    )
};
