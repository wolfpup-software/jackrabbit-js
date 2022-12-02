// brian taylor vann
// store

import type {
  Collection,
  LoggerInterface,
  StoreAction,
  StoreDataInterface,
  StoreInterface,
  Test,
} from "../utils/jackrabbit_types.ts";

import { PENDING, UNSUBMITTED } from "../utils/constants.ts";
import { reactions } from "./reactions.ts";

function createInitialData(): StoreDataInterface {
  return {
    tests: [],
    testResults: [],
    collectionResults: [],
    status: UNSUBMITTED,
    endTime: 0,
    startTime: 0,
    testTime: 0,
  };
}

const createTestResults = (
  storeData: StoreDataInterface,
  tests: Test[],
) => {
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
  storeData: StoreDataInterface,
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
  data: StoreDataInterface;
  logger: LoggerInterface;

  constructor(run: Collection[], logger: LoggerInterface) {
    this.data = createInitialData();
    this.logger = logger;

    createCollectionResults(this.data, run);
  }

  dispatch(action: StoreAction) {
    const reaction = reactions[action.type];
    if (reaction === undefined) return;

    reaction(this.data, action);
    this.logger.log(this.data, action);
  }
}

export { Store };

