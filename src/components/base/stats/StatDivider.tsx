import React, { CSSProperties } from 'react';
import { colors } from '../../../helpers/style-variables';

const style: CSSProperties = {
    backgroundColor: colors.primaryBorder,
    marginBottom: '5px',
    marginTop: '5px',
}

export const StatDivider: React.FC = () => (
    <hr style={style} />
);
