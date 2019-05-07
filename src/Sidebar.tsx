import React from 'react';
import { UploadButton } from './components/UploadButton';
import './Sidebar.css';

export interface SidebarProps {
    // handleImportBeatmap: () => void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> = props => {
    function handleImportBeatmap() {
        // TODO
    };

    return (
        <div className="component">
            <UploadButton variant="primary" onUpload={handleImportBeatmap}>
                Import Beatmap
            </UploadButton>
        </div>
    )
};
