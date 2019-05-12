import React, { CSSProperties } from 'react';
import Table from 'react-bootstrap/Table';
import { getSliderComputedProperties } from '../../helpers/beatmap-difficulty';
import { isCircle, isSlider, isSpinner } from '../../helpers/type-inference';
import { round } from '../../helpers/utilities';
import { Beatmap } from '../../types/Beatmap';
import { HitObject, HitObjectType } from '../../types/HitObject';
import { Point } from '../../types/Point';
import { StyleMap } from '../../types/StyleMap';

export interface HitObjectTableProps {
    beatmap: Beatmap;
}

const styles: StyleMap = {
    table: {
        // backgroundColor: 'white',
        // fontFamily: 'Roboto',
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
    content: (hitObject: HitObject) => number | string;
    style?: CSSProperties;
}

export function pointToString(point: Point): string {
    return `(${point.x}, ${point.y})`;
}

export const HitObjectTable: React.FC<HitObjectTableProps> = ({ beatmap }) => {
    const tableContent: TableColumn[] = [
        {
            header: 'Time',
            content: hitObject => hitObject.startTime,
            style: styles.value,
        },
        // {
        //     header: 'x',
        //     content: hitObject => hitObject.x,
        //     style: styles.value,
        // },
        // {
        //     header: 'y',
        //     content: hitObject => hitObject.y,
        //     style: styles.value,
        // },
        {
            header: 'Position',
            content: hitObject => pointToString(hitObject),
            style: styles.centered,
        },
        {
            header: 'End Pos',
            content: hitObject => {
                if (isCircle(hitObject)) {
                    // return pointToString(hitObject);
                    return '-';
                }

                if (isSpinner(hitObject)) {
                    return '-';
                }

                const nestedObjects = hitObject.metadata.nestedHitObjects;
                const legacyLastTick = nestedObjects[nestedObjects.length - 1];
                const position = legacyLastTick.position;
                return `(${Math.round(position.x)}, ${Math.round(position.y)})`;
            },
            style: styles.centered,
        },
        {
            header: 'Type',
            content: hitObject => HitObjectType[hitObject.type],
            style: styles.centered,
        },
        // {
        //     header: 'Index in Combo',
        //     content: hitObject => hitObject.indexInCurrentCombo,
        //     style: styles.value,
        // },
        // {
        //     header: 'Combo Index',
        //     content: hitObject => hitObject.comboIndex,
        //     style: styles.value,
        // },
        // {
        //     header: 'Last in Combo',
        //     content: hitObject => hitObject.lastInCombo ? 1 : 0,
        //     style: styles.value,
        // },
        {
            header: 'Stacked Position',
            content: hitObject => `(${hitObject.metadata.stackedPosition.x}, ${hitObject.metadata.stackedPosition.y})`,
            style: styles.centered,
        },
        // {
        //     header: 'Stack Height',
        //     content: hitObject => isSpinner(hitObject) ? '-' : hitObject.metadata.stackHeight,
        //     style: styles.value,
        // },
        {
            header: 'Repeat Count',
            content: hitObject => isSlider(hitObject) ? hitObject.metadata.repeatCount : '-',
            style: styles.value,
        },
        {
            header: 'Velocity',
            content: hitObject => isSlider(hitObject) ? round(hitObject.metadata.velocity, 2) : '-',
            style: styles.value,
        },
        {
            header: 'Tick Distance',
            content: hitObject => isSlider(hitObject) ? round(hitObject.metadata.tickDistance, 2) : '-',
            style: styles.value,
        },
        {
            header: '# Nested',
            content: hitObject => isSlider(hitObject) ? hitObject.metadata.nestedHitObjects.length : '-',
            style: styles.value,
        },
        {
            header: 'Path Distance',
            content: hitObject => {
                if (!isSlider(hitObject)) {
                    return '-';
                }

                const computedProperties = getSliderComputedProperties(hitObject);
                return computedProperties.pathDistance;
            },
            style: styles.value,
        },
        {
            header: 'Span Duration',
            content: hitObject => {
                if (!isSlider(hitObject)) {
                    return '-';
                }

                const computedProperties = getSliderComputedProperties(hitObject);
                return round(computedProperties.spanDuration, 2);
            },
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
                {beatmap.hitObjects.map((hitObject, objIndex) => {
                    return (
                        <tr key={objIndex}>
                            {tableContent.map((column, columnIndex) => (
                                <td
                                    key={(objIndex * numColumns + columnIndex)}
                                    style={column.style}
                                >
                                    {column.content(hitObject)}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
