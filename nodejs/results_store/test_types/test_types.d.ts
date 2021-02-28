import { Assertions } from "../results_store";
declare type SyncTest = () => Assertions;
declare type AsyncTest = () => Promise<Assertions>;
declare type Test = SyncTest | AsyncTest;
declare type TestParams = {
    title: string;
    tests: Test[];
    runTestsAsynchronously?: boolean;
    timeoutInterval?: number;
};
declare type TestCollection = TestParams[];
export { Test, TestParams, TestCollection };
