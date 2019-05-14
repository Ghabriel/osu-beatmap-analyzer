import { CSSProperties } from 'react';

export function merge(...styles: (CSSProperties | boolean)[]): CSSProperties {
    const result: CSSProperties = {};

    for (const style of styles) {
        if (style) {
            Object.assign(result, style);
        }
    }

    return result;
}

// type KeysToNumber<T> = ({ [K in keyof T]: T[K] extends number ? K : never })[keyof T];

// export function sortBy<T, K extends KeysToNumber<T>>(list: T[], field: K) {
//     (list as any[]).sort((a, b) => a[field] - b[field]);
// }

export function sortBy<T extends string>(list: Record<T, number>[], field: T) {
    return list.sort((a, b) => a[field] - b[field]);
}

export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function round(value: number, decimalPlaces: number): string {
    const exponent = Math.pow(10, decimalPlaces);

    return (Math.round(value * exponent) / exponent).toString();
}

export function coalesce<T, U>(value: T | undefined, fallback: U): T | U {
    if (value === undefined) {
        return fallback;
    }

    return value;
}

export function getListMode(list: number[]): number {
    type Table = { [value: number]: number };

    const valueFrequencies = list
        .reduce((table, value) => {
            table[value] = (table[value] || 0) + 1;
            return table;
        }, {} as Table);

    return parseFloat(
        Object.entries(valueFrequencies)
            .sort(([v1, count1], [v2, count2]) => count2 - count1)
            .map(([v, _]) => v)[0]
    );
}

export function hasFlag<T extends number>(enumValue: T, flag: T): boolean {
    return (enumValue & flag) > 0;
}

export function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}
