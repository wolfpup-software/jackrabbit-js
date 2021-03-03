import type { TestRunResults } from "../state_types/state_types";
import type { EndTestCollectionActionParams } from "../../action_types/actions_types";
declare type EndTestCollection = (results: TestRunResults, params: EndTestCollectionActionParams) => TestRunResults;
declare const endTestCollectionState: EndTestCollection;
export { endTestCollectionState };
