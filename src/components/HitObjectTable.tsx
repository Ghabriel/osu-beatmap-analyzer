import React, { CSSProperties } from 'react';
import Table from 'react-bootstrap/Table';
import { isSlider, isSpinner } from '../helpers/type-inference';
import { Beatmap } from '../types/Beatmap';
import { HitObject, HitObjectType } from '../types/HitObject';
import { StyleMap } from '../types/StyleMap';

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
    }
};

interface TableColumn {
    header: string;
    content: (hitObject: HitObject) => number | string;
    style?: CSSProperties;
}

function round(value: number, decimalPlaces: number): string {
    const exponent = Math.pow(10, decimalPlaces);

    return (Math.round(value * exponent) / exponent).toString();
}

export const HitObjectTable: React.FunctionComponent<HitObjectTableProps> = ({ beatmap }) => {
    const tableContent: TableColumn[] = [
        {
            header: 'Time',
            content: hitObject => hitObject.startTime,
            style: styles.value,
        },
        {
            header: 'x',
            content: hitObject => hitObject.x,
            style: styles.value,
        },
        {
            header: 'y',
            content: hitObject => hitObject.y,
            style: styles.value,
        },
        {
            header: 'Type',
            content: hitObject => HitObjectType[hitObject.type],
        },
        {
            header: 'Index in Combo',
            content: hitObject => hitObject.indexInCurrentCombo,
            style: styles.value,
        },
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
        },
        {
            header: 'Stack Height',
            content: hitObject => isSpinner(hitObject) ? '-' : hitObject.metadata.stackHeight,
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
        // {
        //     header: 'Time',
        //     content: hitObject => hitObject.startTime,
        //     style: styles.value,
        // },
    ];

    return (
        <Table style={styles.table}>
            <thead>
                <tr>
                    {tableContent.map(column => (
                        <th scope="col" style={column.style}>{column.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {beatmap.hitObjects.map((hitObject, objIndex) => {
                    return (
                        <tr key={objIndex}>
                            {tableContent.map(column => (
                                <td style={column.style}>{column.content(hitObject)}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
