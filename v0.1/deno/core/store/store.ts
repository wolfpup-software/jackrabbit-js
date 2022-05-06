// brian taylor vann
// store

import type {
  Callback,
  Collection,
  StoreAction,
  StoreData,
  StoreInterface,
  Test,
} from "../utils/jackrabbit_types.ts";

import { PENDING, UNSUBMITTED } from "../utils/constants.ts";
import { reactions } from "./reactions.ts";

function createInitialData(): StoreData {
  return {
    testResults: [],
    collectionResults: [],
    result: {
      status: UNSUBMITTED,
      endTime: 0,
      startTime: 0,
      testTime: 0,
    },
    tests: [],
  };
}

const createTestResults = (storeData: StoreData, tests: Test[]) => {
  const startIndex = storeData.testResults.length;
  for (const test of tests) {
    const testID = storeData.tests.length;
    storeData.tests.push(test);

    const testResultID = storeData.testResults.length;
    storeData.testResults.push({
      assertions: [],
      endTime: 0,
      name: test.name,
      startTime: 0,
      status: PENDING,
      testResultID,
      testID,
    });
  }

  const endIndex = storeData.testResults.length;

  return [startIndex, endIndex];
};

const createCollectionResults = (
  storeData: StoreData,
  collections: Collection[],
) => {
  for (const collection of collections) {
    const collectionResultID = storeData.collectionResults.length;
    const { tests, title, runTestsAsynchronously, timeoutInterval } =
      collection;
    const indices = createTestResults(storeData, tests);

    storeData.collectionResults.push({
      endTime: 0,
      testTime: 0,
      startTime: 0,
      status: PENDING,
      collectionResultID,
      indices,
      timeoutInterval,
      runTestsAsynchronously,
      title,
    });
  }
};

class Store implements StoreInterface {
  data: StoreData = createInitialData();
  private callback: Callback | undefined;

  setup(run: Collection[], callback?: Callback) {
    createCollectionResults(this.data, run);
    this.callback = callback;
  }

  teardown() {
    this.callback = undefined;
  }

  dispatch(action: StoreAction) {
    const reaction = reactions[action.type];
    if (reaction === undefined) return;

    reaction(this.data, action);
    this.callback?.(this.data, action);
  }
}

export { createInitialData, Store };
