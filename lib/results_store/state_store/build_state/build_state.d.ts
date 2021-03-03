import type { TestRunResults } from "../state_types/state_types";
import type { StartTestRunActionParams } from "../../action_types/actions_types";
declare type BuildResultsState = (params: StartTestRunActionParams) => TestRunResults;
declare const buildResultsState: BuildResultsState;
export { buildResultsState };
