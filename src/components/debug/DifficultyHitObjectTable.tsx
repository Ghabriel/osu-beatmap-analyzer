import React, { CSSProperties } from 'react';
import Table from 'react-bootstrap/Table';
import { round } from '../../helpers/utilities';
import { Beatmap } from '../../types/Beatmap';
import { DifficultyHitObject } from '../../types/DifficultyHitObject';
import { StyleMap } from '../../types/StyleMap';

export interface DifficultyHitObjectTableProps {
    beatmap: Beatmap;
}

const styles: StyleMap = {
    table: {
        marginTop: '15px',
    },

    value: {
        textAlign: 'right',
    },

    centered: {
        textAlign: 'center',
    },
};

interface TableColumn {
    header: string;
    content: (object: DifficultyHitObject) => number | string;
    style?: CSSProperties;
}

export const DifficultyHitObjectTable: React.FC<DifficultyHitObjectTableProps> = ({ beatmap }) => {
    const tableContent: TableColumn[] = [
        {
            header: 'lastLast',
            content: object => (object.lastLast === null) ? '-' : object.lastLast.startTime,
            style: styles.value,
        },
        {
            header: 'last',
            content: object => object.last.startTime,
            style: styles.value,
        },
        {
            header: 'current',
            content: object => object.current.startTime,
            style: styles.value,
        },
        // {
        //     header: 'lastLast',
        //     content: object => {
        //         if (object.lastLast === null) {
        //             return '-';
        //         }

        //         return `(${object.lastLast.x}, ${object.lastLast.y})`;
        //     },
        //     style: styles.centered,
        // },
        // {
        //     header: 'last',
        //     content: object => `(${object.last.x}, ${object.last.y})`,
        //     style: styles.centered,
        // },
        // {
        //     header: 'current',
        //     content: object => `(${object.current.x}, ${object.current.y})`,
        //     style: styles.centered,
        // },
        // {
        //     header: 'lastLast Type',
        //     content: object => (object.lastLast === null) ? '-' : HitObjectType[object.lastLast.type],
        //     style: styles.centered,
        // },
        // {
        //     header: 'last Type',
        //     content: object => HitObjectType[object.last.type],
        //     style: styles.centered,
        // },
        // {
        //     header: 'current Type',
        //     content: object => HitObjectType[object.current.type],
        //     style: styles.centered,
        // },
        // {
        //     header: 'lastLast End Position',
        //     content: object => {
        //         if (object.lastLast === null || !isSlider(object.lastLast)) {
        //             return '-';
        //         }

        //         const nestedObjects = object.lastLast.metadata.nestedHitObjects;
        //         const legacyLastTick = nestedObjects[nestedObjects.length - 1];
        //         const position = legacyLastTick.position;
        //         return `(${Math.round(position.x)}, ${Math.round(position.y)})`;
        //     },
        //     style: styles.centered,
        // },
        // {
        //     header: 'last End Position',
        //     content: object => {
        //         if (!isSlider(object.last)) {
        //             return '-';
        //         }

        //         const nestedObjects = object.last.metadata.nestedHitObjects;
        //         const legacyLastTick = nestedObjects[nestedObjects.length - 1];
        //         const position = legacyLastTick.position;
        //         return `(${Math.round(position.x)}, ${Math.round(position.y)})`;
        //     },
        //     style: styles.centered,
        // },
        // {
        //     header: 'current End Position',
        //     content: object => {
        //         if (!isSlider(object.current)) {
        //             return '-';
        //         }

        //         const nestedObjects = object.current.metadata.nestedHitObjects;
        //         const legacyLastTick = nestedObjects[nestedObjects.length - 1];
        //         const position = legacyLastTick.position;
        //         return `(${Math.round(position.x)}, ${Math.round(position.y)})`;
        //     },
        //     style: styles.centered,
        // },
        {
            header: 'deltaTime',
            content: object => object.deltaTime,
            style: styles.value,
        },
        {
            header: 'strainTime',
            content: object => object.strainTime,
            style: styles.value,
        },
        {
            header: 'travelDistance',
            content: object => round(object.travelDistance, 2),
            style: styles.value,
        },
        {
            header: 'jumpDistance',
            content: object => round(object.jumpDistance, 2),
            style: styles.value,
        },
        {
            header: 'angle (deg)',
            content: object => (object.angle === null) ? '-' : round(object.angle * 180 / Math.PI, 2),
            style: styles.value,
        },
        // {
        //     header: 'Time',
        //     content: hitObject => hitObject.startTime,
        //     style: styles.value,
        // },
    ];

    const numColumns = tableContent.length;

    return (
        <Table style={styles.table}>
            <thead>
                <tr>
                    {tableContent.map((column, index) => (
                        <th key={index} scope="col" style={column.style}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {beatmap.difficultyHitObjects.map((object, objIndex) => {
                    return (
                        <tr key={objIndex}>
                            {tableContent.map((column, columnIndex) => (
                                <td
                                    key={(objIndex * numColumns + columnIndex)}
                                    style={column.style}
                                >
                                    {column.content(object)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
