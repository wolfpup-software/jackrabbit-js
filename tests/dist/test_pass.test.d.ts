declare function testMoreStuffAndPass(): any[];
declare function testMoreStuffAndPassAsync(): Promise<[]>;
export declare const tests: (typeof testMoreStuffAndPass | typeof testMoreStuffAndPassAsync)[];
export declare const options: {
    title: string;
};
export {};
