declare function testsFail(): Promise<string>;
export declare const testModules: {
    tests: (typeof testsFail)[];
    options: {
        title: string;
    };
}[];
export {};
