import { Assertions, Test, TestParams, TestCollection, TestRunResults } from "../results_store/results_store";
import { cancelRun } from "./relay_results/relay_results";
interface StartLtrTestRunParams {
    testCollection: TestCollection;
}
declare type StartLtrTestRun = (params: StartLtrTestRunParams) => Promise<TestRunResults | undefined>;
declare const runTests: StartLtrTestRun;
export { Assertions, Test, TestParams, TestCollection, runTests, cancelRun };
