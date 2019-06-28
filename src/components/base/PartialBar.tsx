import React from 'react';
import { clamp } from '../../helpers/utilities';
import './PartialBar.scss';

export interface PartialBarProps {
    fraction: number;
}

export const PartialBar: React.FC<PartialBarProps> = props => {
    const filledPercentage = 100 * clamp(props.fraction, 0, 1);

    return (
        <div className="partial-bar">
            <div className="filled" style={{ flexBasis: filledPercentage + '%' }}></div>
            <div className="empty" style={{ flexBasis: (100 - filledPercentage) + '%' }}></div>
        </div>
    );
};
