// brian taylor vann
// actions

import type {
  CollectionResult,
  Reactions,
  StoreAction,
  StoreData,
} from "../utils/jackrabbit_types.ts";

import {
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  FAILED,
  PASSED,
  START_COLLECTION,
  START_RUN,
  START_TEST,
  UNSUBMITTED,
} from "../utils/constants.ts";

/*
  All store actions and supporting functions must be syncronous
*/

function updateResultProperties(storeData: StoreData) {
  const { result } = storeData;
  let testTime = 0;

  for (const collectionResult of storeData.collectionResults) {
    if (collectionResult.status === FAILED) {
      result.status = FAILED;
    }

    testTime += collectionResult.testTime;
  }

  // set updated properties
  if (result.status === UNSUBMITTED) {
    result.status = PASSED;
  }

  result.testTime = testTime;
}

function updateCollectionResult(
  storeData: StoreData,
  collectionResult: CollectionResult,
) {
  let { indices, startTime, endTime } = collectionResult;
  let testTime = endTime - startTime;
  const target = indices[1];
  let index = indices[0];

  while (index < target) {
    const { result } = storeData;

    if (result.status === FAILED) {
      collectionResult.status = FAILED;
      break;
    }

    index += 1;
  }

  // set updated properties
  if (collectionResult.status === UNSUBMITTED) {
    collectionResult.status = PASSED;
  }
  collectionResult.testTime = testTime;
}

/*
  ACTIONS
*/

function start_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_RUN) return;

  const { result } = storeData;
  result.status = UNSUBMITTED;
  result.startTime = action.startTime;
}

function end_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_RUN) return;

  const { result } = storeData;
  if (result.status === CANCELLED) return;

  result.endTime = action.endTime;

  updateResultProperties(storeData);
}

function cancel_run(storeData: StoreData, action: StoreAction) {
  if (action.type !== CANCEL_RUN) return;

  const { result } = storeData;

  result.status = CANCELLED;
  result.endTime = action.endTime;
}

function start_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_COLLECTION) return;

  const { collectionResultID, startTime } = action;

  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  collectionResult.status = UNSUBMITTED;
  collectionResult.startTime = startTime;
}

function end_collection(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_COLLECTION) return;

  const { collectionResultID, endTime } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }

  collectionResult.endTime = endTime;

  // update properties
  updateCollectionResult(storeData, collectionResult);
}

function start_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== START_TEST) return;

  const { testResultID, startTime } = action;
  const testResult = storeData.testResults[testResultID];
  if (testResult === undefined) {
    return;
  }

  testResult.status = UNSUBMITTED;
  testResult.startTime = startTime;
}

function end_test(storeData: StoreData, action: StoreAction) {
  if (action.type !== END_TEST) return;

  const { testResultID } = action;
  const testResult = storeData.testResults[testResultID];
  if (testResult === undefined) {
    return;
  }

  const { assertions, endTime } = action;
  testResult.assertions = assertions;
  testResult.endTime = endTime;
  testResult.status = assertions.length === 0 ? PASSED : FAILED;
}

const reactions: Reactions = {
  start_run,
  end_run,
  cancel_run,
  start_collection,
  end_collection,
  start_test,
  end_test,
};

export { reactions };
