import type { TestRunResults } from "../state_types/state_types";
import type { StartTestCollectionActionParams } from "../../action_types/actions_types";
declare type StartTestCollection = (results: TestRunResults, params: StartTestCollectionActionParams) => TestRunResults;
declare const startTestCollectionState: StartTestCollection;
export { startTestCollectionState };
