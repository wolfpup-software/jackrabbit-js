import { Test } from "../../results_store/results_store";
interface RunTestsParams {
    timeoutInterval?: number;
    tests: Test[];
    collectionID: number;
    startTime: number;
}
declare type RunTests = (params: RunTestsParams) => Promise<void>;
declare const runTestsAllAtOnce: RunTests;
declare const runTestsInOrder: RunTests;
export { runTestsInOrder, runTestsAllAtOnce };
