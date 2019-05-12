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
