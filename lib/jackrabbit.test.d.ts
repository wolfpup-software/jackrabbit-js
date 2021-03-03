declare const tests: {
    title: string;
    tests: (() => string[])[];
    runTestsAsynchronously: boolean;
}[];
export { tests };
