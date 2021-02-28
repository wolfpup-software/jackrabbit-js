import { TestRunResults } from "../state_types/state_types";
import { EndTestRunActionParams } from "../../action_types/actions_types";
declare type EndTestRun = (results: TestRunResults, params: EndTestRunActionParams) => TestRunResults;
declare const endTestRunState: EndTestRun;
export { endTestRunState };
