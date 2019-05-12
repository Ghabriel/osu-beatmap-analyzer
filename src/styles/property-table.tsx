import { colors } from '../helpers/style-variables';
import { StyleMap } from '../types/StyleMap';

export const propertyTableStyles: StyleMap = {
    frame: {
        border: `1px solid ${colors.primaryBorder}`,
        marginTop: '15px',
        padding: '5px',
    },

    trait: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },

    traitKey: {
        fontWeight: 'bold',
        width: '150px',
    },

    traitValue: {
        marginLeft: '10px',
    },
};
