// brian taylor vann
// start test state

import type { TestRunResults } from "../state_types/state_types.ts";
import type { StartTestActionParams } from "../../action_types/actions_types.ts";

type StartTest = (
  results: TestRunResults,
  params: StartTestActionParams
) => TestRunResults;

const startTestState: StartTest = (runResults, params) => {
  if (runResults.results === undefined) {
    return runResults;
  }

  const { startTime, collectionID, testID } = params;

  const testResult = runResults?.results?.[collectionID]?.results?.[testID];
  if (testResult) {
    testResult.status = "submitted";
    testResult.startTime = startTime;
  }

  return runResults;
};

export { startTestState };
