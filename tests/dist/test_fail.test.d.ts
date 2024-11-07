declare function testStuffAndFail(): string;
declare function testMoreStuffAndFail(): string[];
declare function testStuffAndFailAsync(): Promise<string>;
declare function testMoreStuffAndFailAsync(): Promise<string[]>;
export declare const tests: (typeof testStuffAndFail | typeof testMoreStuffAndFail | typeof testStuffAndFailAsync | typeof testMoreStuffAndFailAsync)[];
export declare const options: {
    title: string;
};
export {};
