const PENDING = "pending";
const UNSUBMITTED = "unsubmitted";
const CANCELLED = "cancelled";
const PASSED = "passed";
const FAILED = "failed";
const BUILD_RUN = "build_run";
const START_RUN = "start_run";
const END_RUN = "end_run";
const CANCEL_RUN = "cancel_run";
const START_COLLECTION = "start_collection";
const END_COLLECTION = "end_collection";
const START_TEST = "start_test";
const END_TEST = "end_test";
const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
const createTimeout = async (timeoutInterval) => {
  const interval = timeoutInterval === -1 ? 10000 : timeoutInterval;
  await sleep(interval);
  return [
    `timed out at: ${timeoutInterval}`,
  ];
};
async function execRun(store) {
  const startTime = performance.now();
  store.dispatch({
    type: START_RUN,
    startTime,
  });
  for (const collectionResult of store.getState().collectionResults) {
    if (runIsCancelled(store)) {
      return;
    }
    collectionResult.runTestsAsynchronously
      ? await execCollection(store, collectionResult)
      : await execCollectionOrdered(store, collectionResult);
  }
  const endTime = performance.now();
  if (runIsCancelled(store)) {
    return;
  }
  store.dispatch({
    type: END_RUN,
    endTime,
  });
}
function cancelRun(store) {
  store.dispatch({
    type: CANCEL_RUN,
    endTime: performance.now(),
  });
}
async function execTest(store, testResult, timeoutInterval) {
  const { testResultID } = testResult;
  const testFunc = store.getTest(testResultID);
  const startTime = performance.now();
  store.dispatch({
    type: START_TEST,
    testResultID,
    startTime,
  });
  const assertions = testFunc !== undefined
    ? await Promise.race([
      createTimeout(timeoutInterval),
      testFunc(),
    ])
    : [];
  const endTime = performance.now();
  if (runIsCancelled(store)) return;
  store.dispatch({
    type: END_TEST,
    testResultID,
    assertions,
    endTime,
  });
}
async function execCollection(store, collectionResuilt) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  const tests = [];
  let target = indices[0];
  const dest = indices[1];
  while (target <= dest) {
    const testResult = store.getState().testResults[target];
    if (testResult !== undefined) {
      tests.push(execTest(store, testResult, timeoutInterval));
    }
    target += 1;
  }
  const startTime = performance.now();
  store.dispatch({
    type: START_COLLECTION,
    collectionResultID,
    startTime,
  });
  await Promise.all(tests);
  const endTime = performance.now();
  if (runIsCancelled(store)) return;
  store.dispatch({
    type: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}
async function execCollectionOrdered(store, collectionResuilt) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  const dest = indices[1];
  let target = indices[0];
  const startTime = performance.now();
  store.dispatch({
    type: START_COLLECTION,
    collectionResultID,
    startTime,
  });
  while (target < dest) {
    if (runIsCancelled(store)) return;
    const testResult = store.getState().testResults[target];
    if (testResult !== undefined) {
      await execTest(store, testResult, timeoutInterval);
    }
    target += 1;
  }
  const endTime = performance.now();
  if (runIsCancelled(store)) return;
  store.dispatch({
    type: END_COLLECTION,
    collectionResultID,
    endTime,
  });
}
function runIsCancelled(store) {
  return store.getState().result.status === CANCELLED;
}
class Runner {
  buildRun(store, run) {
    store.dispatch({
      type: "build_run",
      run,
    });
  }
  startRun(store) {
    execRun(store);
  }
  cancelRun(store) {
    cancelRun(store);
  }
}
const createTestResults = (storeData, tests) => {
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
  return [
    startIndex,
    endIndex,
  ];
};
const createCollectionResults = (storeData, collections) => {
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
function updateResultProperties(storeData) {
  const { result } = storeData;
  let { status } = storeData.result;
  let testTime = 0;
  for (const collectionResult of storeData.collectionResults) {
    if (status === UNSUBMITTED && collectionResult.status === FAILED) {
      status = FAILED;
    }
    testTime += collectionResult.testTime;
  }
  result.status = status === UNSUBMITTED ? PASSED : status;
  result.testTime = testTime;
}
function updateCollectionResult(storeData, collectionResult) {
  let testTime = 0;
  let { indices, status } = collectionResult;
  const target = indices[1];
  let index = indices[0];
  while (index < target) {
    const { result } = storeData;
    if (status === UNSUBMITTED && result.status === FAILED) {
      status = FAILED;
    }
    const { startTime, endTime } = result;
    testTime += endTime - startTime;
    index += 1;
  }
  collectionResult.status = status === UNSUBMITTED ? PASSED : status;
  collectionResult.testTime = testTime;
}
function build_run(storeData, action) {
  if (action.type !== BUILD_RUN) return;
  const { run } = action;
  createCollectionResults(storeData, run);
}
function start_run(storeData, action) {
  if (action.type !== START_RUN) return;
  const { startTime } = action;
  const { result } = storeData;
  result.status = UNSUBMITTED;
  result.startTime = startTime;
}
function end_run(storeData, action) {
  if (action.type !== END_RUN) return;
  const { result } = storeData;
  if (result.status === CANCELLED) return;
  const { endTime } = action;
  result.endTime = endTime;
  updateResultProperties(storeData);
}
function cancel_run(storeData, action) {
  if (action.type !== CANCEL_RUN) return;
  const { result } = storeData;
  result.status = CANCELLED;
  result.endTime = action.endTime;
}
function start_collection(storeData, action) {
  if (action.type !== START_COLLECTION) return;
  const { collectionResultID, startTime } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }
  collectionResult.status = UNSUBMITTED;
  collectionResult.startTime = startTime;
}
function end_collection(storeData, action) {
  if (action.type !== END_COLLECTION) return;
  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }
  const { endTime } = action;
  collectionResult.endTime = endTime;
  updateCollectionResult(storeData, collectionResult);
}
function start_test(storeData, action) {
  if (action.type !== START_TEST) return;
  const { testResultID, startTime } = action;
  const testResult = storeData.testResults[testResultID];
  if (testResult === undefined) {
    return;
  }
  testResult.status = UNSUBMITTED;
  testResult.startTime = startTime;
}
function end_test(storeData, action) {
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
const reactions = {
  build_run,
  start_run,
  end_run,
  cancel_run,
  start_collection,
  end_collection,
  start_test,
  end_test,
};
function translate(source) {
  const { testResults, collectionResults, result } = source;
  return {
    testResults,
    collectionResults,
    result,
  };
}
class Store {
  data;
  broadcastData;
  callback = () => {
  };
  constructor(data) {
    this.data = data;
    this.broadcastData = translate(this.data);
  }
  setCallback(callback) {
    this.callback = callback;
  }
  dispatch(action) {
    const reaction = reactions[action.type];
    if (reaction === undefined) return;
    reaction(this.data, action);
    this.broadcastData = translate(this.data);
    this.callback(this.broadcastData);
  }
  getState() {
    return this.broadcastData;
  }
  getTest(id) {
    return this.data.tests[id];
  }
}
export { Runner as Jackrabbit };
export { Store as DataStore };
