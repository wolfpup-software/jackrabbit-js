const PENDING = "pending";
const SUBMITTED = "submitted";
const CANCELLED = "cancelled";
const PASSED = "passed";
const FAILED = "failed";
const INDEX_ERROR = "index_error";
const BUILD_RUN = "build_run";
const START_RUN = "start_run";
const END_RUN = "end_run";
const CANCEL_RUN = "cancel_run";
const START_COLLECTION = "start_collection";
const END_COLLECTION = "end_collection";
const START_UNIT_TEST = "start_unit_test";
const END_UNIT_TEST = "end_unit_test";
const createUnitTestResults = (storeData, tests) => {
  const startIndex = storeData.testResults.length;
  for (const test of tests) {
    const unitTestID = storeData.unitTests.length;
    storeData.unitTests.push(test);
    const unitTestResultID = storeData.testResults.length;
    storeData.testResults.push({
      assertions: [],
      endTime: -1,
      name: test.name,
      startTime: -1,
      status: PENDING,
      unitTestResultID,
      unitTestID,
    });
  }
  const endIndex = storeData.testResults.length;
  return [
    startIndex,
    endIndex,
  ];
};
const createCollectionResults = (storeData, collections) => {
  const startIndex = storeData.collectionResults.length;
  for (const collection of collections) {
    const collectionResultID = storeData.collectionResults.length;
    const { tests, title, runTestsAsynchronously, timeoutInterval } =
      collection;
    const indices = createUnitTestResults(storeData, tests);
    storeData.collectionResults.push({
      endTime: -1,
      testTime: -1,
      startTime: -1,
      status: PENDING,
      collectionResultID,
      indices,
      timeoutInterval,
      runTestsAsynchronously,
      title,
    });
  }
  const endIndex = storeData.testResults.length;
  return [
    startIndex,
    endIndex,
  ];
};
function updateRunResultProperties(storeData, runResult) {
  let { status } = runResult;
  let testTime = 0;
  const { indices } = runResult;
  let index = indices[0];
  const target = indices[1];
  while (index < target) {
    const collectionResult = storeData.collectionResults[index];
    if (collectionResult === undefined) {
      status = INDEX_ERROR;
      break;
    }
    if (status === SUBMITTED && collectionResult.status === FAILED) {
      status = FAILED;
    }
    const { startTime, endTime } = collectionResult;
    if (startTime !== -1 && endTime !== -1) {
      testTime += endTime - startTime;
    }
    index += 1;
  }
  runResult.status = status === SUBMITTED ? PASSED : status;
  runResult.testTime = testTime;
}
function updateCollectionResult(storeData, collectionResult) {
  let { status } = collectionResult;
  let testTime = 0;
  const { indices } = collectionResult;
  let index = indices[0];
  const target = indices[1];
  while (index < target) {
    const testResult = storeData.testResults[index];
    if (testResult === undefined) {
      status = INDEX_ERROR;
      break;
    }
    if (status === SUBMITTED && testResult.status === FAILED) {
      status = FAILED;
    }
    const { startTime, endTime } = testResult;
    if (startTime !== -1 && endTime !== -1) {
      testTime += endTime - startTime;
    }
    index += 1;
  }
  collectionResult.status = status === SUBMITTED ? PASSED : status;
  collectionResult.testTime = testTime;
}
function build_run(storeData, action) {
  if (action.kind !== BUILD_RUN) return;
  const { runResultID, run } = action;
  const indices = createCollectionResults(storeData, run);
  storeData.runResults.push({
    status: SUBMITTED,
    endTime: -1,
    startTime: -1,
    testTime: -1,
    runResultID,
    indices,
  });
}
function start_run(storeData, action) {
  if (action.kind !== START_RUN) return;
  const { runResultID, startTime } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }
  runResults.status = SUBMITTED;
  runResults.startTime = startTime;
}
function end_run(storeData, action) {
  if (action.kind !== END_RUN) return;
  const { runResultID } = action;
  const runResult = storeData.runResults[runResultID];
  if (runResult === undefined || runResult.status === CANCELLED) {
    return;
  }
  runResult.endTime = action.endTime;
  updateRunResultProperties(storeData, runResult);
}
function cancel_run(storeData, action) {
  if (action.kind !== CANCEL_RUN) return;
  const { runResultID } = action;
  const runResults = storeData.runResults[runResultID];
  if (runResults === undefined) {
    return;
  }
  runResults.endTime = action.endTime;
  runResults.status = CANCELLED;
}
function start_collection(storeData, action) {
  if (action.kind !== START_COLLECTION) return;
  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }
  collectionResult.startTime = action.startTime;
  collectionResult.status = SUBMITTED;
}
function end_collection(storeData, action) {
  if (action.kind !== END_COLLECTION) return;
  const { collectionResultID } = action;
  const collectionResult = storeData.collectionResults[collectionResultID];
  if (collectionResult === undefined) {
    return;
  }
  collectionResult.endTime = action.endTime;
  updateCollectionResult(storeData, collectionResult);
}
function start_unit_test(storeData, action) {
  if (action.kind !== START_UNIT_TEST) return;
  const { unitTestResultID, startTime } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }
  testResult.status = SUBMITTED;
  testResult.startTime = startTime;
}
function end_unit_test(storeData, action) {
  if (action.kind !== END_UNIT_TEST) return;
  const { unitTestResultID, endTime, assertions } = action;
  const testResult = storeData.testResults[unitTestResultID];
  if (testResult === undefined) {
    return;
  }
  testResult.assertions = assertions;
  testResult.status = assertions.length === 0 ? PASSED : FAILED;
  testResult.endTime = endTime;
}
const actions1 = {
  build_run,
  start_run,
  end_run,
  cancel_run,
  start_collection,
  end_collection,
  start_unit_test,
  end_unit_test,
};
class Broadcaster {
  receipt = -1;
  subscriptions = new Map();
  subscribe(resultsCallback) {
    this.receipt += 1;
    this.subscriptions.set(this.receipt, resultsCallback);
    return this.receipt;
  }
  unsubscribe(receipt) {
    this.subscriptions.delete(receipt);
  }
  broadcast(message) {
    for (const subscription of this.subscriptions.values()) {
      subscription(message);
    }
  }
}
class Store {
  broadcaster = new Broadcaster();
  data = {
    unitTests: [],
    testResults: [],
    collectionResults: [],
    runResults: [],
  };
  actions = actions1;
  buildRun(run) {
    const runResultID = this.data.runResults.length;
    this.dispatch({
      kind: BUILD_RUN,
      runResultID,
      run,
    });
    return runResultID;
  }
  dispatch(action) {
    const response = this.actions[action.kind];
    if (response === undefined) return;
    response(this.data, action);
    const data = {
      testResults: this.data.testResults,
      collectionResults: this.data.collectionResults,
      runResults: this.data.runResults,
    };
    if (action.kind === BUILD_RUN) {
      const { runResultID } = action;
      this.broadcaster.broadcast({
        data,
        action: {
          kind: BUILD_RUN,
          runResultID,
        },
      });
    }
    this.broadcaster.broadcast({
      data,
      action,
    });
  }
}
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
async function execRun(store, receipt) {
  const runResult = store.data.runResults[receipt];
  if (runResult === undefined) {
    return;
  }
  const { indices, runResultID } = runResult;
  store.dispatch({
    kind: START_RUN,
    runResultID,
    startTime: performance.now(),
  });
  const dest = indices[1];
  let target = indices[0];
  while (target < dest) {
    if (runIsCancelled(store, receipt)) {
      return;
    }
    const collection = store.data.collectionResults[target];
    if (collection !== undefined) {
      collection.runTestsAsynchronously
        ? await execCollection(store, receipt, collection)
        : await execCollectionOrdered(store, receipt, collection);
    }
    target += 1;
  }
  if (runIsCancelled(store, receipt)) {
    return;
  }
  store.dispatch({
    kind: END_RUN,
    runResultID,
    endTime: performance.now(),
  });
}
async function execUnitTest(store, runreceipt, testResult, timeoutInterval) {
  const { unitTestResultID } = testResult;
  store.dispatch({
    kind: START_UNIT_TEST,
    unitTestResultID,
    startTime: performance.now(),
  });
  const testFunc = store.data.unitTests[unitTestResultID];
  const assertions = testFunc !== undefined
    ? await Promise.race([
      createTimeout(timeoutInterval),
      testFunc(),
    ])
    : [];
  if (runIsCancelled(store, runreceipt)) return;
  store.dispatch({
    kind: END_UNIT_TEST,
    unitTestResultID,
    assertions,
    endTime: performance.now(),
  });
}
async function execCollection(store, runreceipt, collectionResuilt) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  const tests = [];
  let target = indices[0];
  const dest = indices[1];
  while (target <= dest) {
    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      tests.push(execUnitTest(store, runreceipt, testResult, timeoutInterval));
    }
    target += 1;
  }
  store.dispatch({
    kind: START_COLLECTION,
    collectionResultID,
    startTime: performance.now(),
  });
  await Promise.all(tests);
  if (runIsCancelled(store, runreceipt)) return;
  store.dispatch({
    kind: END_COLLECTION,
    collectionResultID,
    endTime: performance.now(),
  });
}
async function execCollectionOrdered(store, runreceipt, collectionResuilt) {
  const { indices, collectionResultID, timeoutInterval } = collectionResuilt;
  let target = indices[0];
  const dest = indices[1];
  store.dispatch({
    kind: START_COLLECTION,
    collectionResultID,
    startTime: performance.now(),
  });
  while (target < dest) {
    if (runIsCancelled(store, runreceipt)) return;
    const testResult = store.data.testResults[target];
    if (testResult !== undefined) {
      await execUnitTest(store, runreceipt, testResult, timeoutInterval);
    }
    target += 1;
  }
  if (runIsCancelled(store, runreceipt)) return;
  store.dispatch({
    kind: END_COLLECTION,
    collectionResultID,
    endTime: performance.now(),
  });
}
function cancelRun(store, receipt) {
  store.dispatch({
    kind: CANCEL_RUN,
    runResultID: receipt,
    endTime: performance.now(),
  });
}
function runIsCancelled(store, receipt) {
  const run = store.data.runResults[receipt];
  if (run === undefined) {
    return true;
  }
  return run.status === CANCELLED;
}
class Runner {
  store = new Store();
  buildRun(run) {
    return this.store.buildRun(run);
  }
  startRun(receipt) {
    execRun(this.store, receipt);
  }
  cancelRun(receipt) {
    cancelRun(this.store, receipt);
  }
  subscribe(subscription) {
    return this.store.broadcaster.subscribe(subscription);
  }
  unsubscribe(receipt) {
    return this.store.broadcaster.unsubscribe(receipt);
  }
}
export { Runner as Jackrabbit };
