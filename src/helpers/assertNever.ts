export function assertNever(value: never): never {
    throw new Error(`Runtime type corruption. Value: ${value}`);
}
