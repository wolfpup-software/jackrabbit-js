import type { Assertions, Test, TestCollection, TestParams, TestRunResults } from "../results_store/results_store";
import { cancelRun } from "./relay_results/relay_results";
interface StartLtrTestRunParams {
    testCollection: TestCollection;
}
declare type StartLtrTestRun = (params: StartLtrTestRunParams) => Promise<TestRunResults | undefined>;
declare const runTests: StartLtrTestRun;
export type { Assertions, Test, TestCollection, TestParams };
export { cancelRun, runTests };
