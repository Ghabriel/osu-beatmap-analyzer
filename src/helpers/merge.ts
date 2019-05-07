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
