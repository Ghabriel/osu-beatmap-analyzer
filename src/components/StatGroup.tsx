import React, { CSSProperties } from 'react';
import { colors } from '../helpers/style-variables';

const style: CSSProperties = {
    border: `1px solid ${colors.primaryBorder}`,
    marginTop: '15px',
    padding: '5px',
};

export const StatGroup: React.FC = ({ children }) => (
    <div style={style}>
        {children}
    </div>
);
