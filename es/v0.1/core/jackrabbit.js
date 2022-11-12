// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const PENDING = "pending";
const UNSUBMITTED = "unsubmitted";
const CANCELLED = "cancelled";
const PASSED = "passed";
const FAILED = "failed";
const START_RUN = "start_run";
const END_RUN = "end_run";
const CANCEL_RUN = "cancel_run";
const START_COLLECTION = "start_collection";
const END_COLLECTION = "end_collection";
const START_TEST = "start_test";
const END_TEST = "end_test";
const sleep = (time)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        }, time);
    });
};
const createTimeout = async (timeoutInterval)=>{
    const interval = timeoutInterval === -1 ? 10000 : timeoutInterval;
    await sleep(interval);
    return [
        `timed out at: ${timeoutInterval}`
    ];
};
async function execRun(store) {
    const startTime = performance.now();
    store.dispatch({
        type: START_RUN,
        startTime
    });
    for (const collectionResult of store.data.collectionResults){
        if (runIsCancelled(store)) {
            return;
        }
        collectionResult.runTestsAsynchronously ? await execCollection(store, collectionResult) : await execCollectionOrdered(store, collectionResult);
    }
    const endTime = performance.now();
    if (runIsCancelled(store)) {
        return;
    }
    store.dispatch({
        type: END_RUN,
        endTime
    });
}
function cancelRun(store) {
    store.dispatch({
        type: CANCEL_RUN,
        endTime: performance.now()
    });
}
async function execTest(store, testResult, timeoutInterval) {
    const { testResultID  } = testResult;
    const testFunc = store.data.tests[testResultID];
    const startTime = performance.now();
    store.dispatch({
        type: START_TEST,
        testResultID,
        startTime
    });
    const assertions = testFunc !== undefined ? await Promise.race([
        createTimeout(timeoutInterval),
        testFunc(),
    ]) : [];
    const endTime = performance.now();
    if (runIsCancelled(store)) return;
    store.dispatch({
        type: END_TEST,
        testResultID,
        assertions,
        endTime
    });
}
async function execCollection(store, collectionResult) {
    if (runIsCancelled(store)) return;
    const { indices , collectionResultID , timeoutInterval  } = collectionResult;
    const tests = [];
    let target = indices[0];
    const dest = indices[1];
    while(target <= dest){
        const testResult = store.data.testResults[target];
        if (testResult !== undefined) {
            tests.push(execTest(store, testResult, timeoutInterval));
        }
        target += 1;
    }
    const startTime = performance.now();
    store.dispatch({
        type: START_COLLECTION,
        collectionResultID,
        startTime
    });
    await Promise.all(tests);
    const endTime = performance.now();
    if (runIsCancelled(store)) return;
    store.dispatch({
        type: END_COLLECTION,
        collectionResultID,
        endTime
    });
}
async function execCollectionOrdered(store, collectionResult) {
    if (runIsCancelled(store)) return;
    const { indices , collectionResultID , timeoutInterval  } = collectionResult;
    const startTime = performance.now();
    store.dispatch({
        type: START_COLLECTION,
        collectionResultID,
        startTime
    });
    const dest = indices[1];
    let target = indices[0];
    while(target < dest){
        if (runIsCancelled(store)) return;
        const testResult = store.data.testResults[target];
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
        endTime
    });
}
function runIsCancelled(store) {
    return store.data.result.status === CANCELLED;
}
class Runner {
    start(store) {
        execRun(store);
    }
    cancel(store) {
        cancelRun(store);
    }
    async run(store) {
        await execRun(store);
    }
}
function updateResultProperties(storeData) {
    const { result  } = storeData;
    let testTime = 0;
    for (const collectionResult of storeData.collectionResults){
        if (collectionResult.status === FAILED) {
            result.status = FAILED;
        }
        testTime += collectionResult.testTime;
    }
    if (result.status === UNSUBMITTED) {
        result.status = PASSED;
    }
    result.testTime = testTime;
}
function updateCollectionResult(storeData, collectionResult) {
    let { indices , startTime , endTime  } = collectionResult;
    let testTime = endTime - startTime;
    const target = indices[1];
    let index = indices[0];
    while(index < target){
        const { result  } = storeData;
        if (result.status === FAILED) {
            collectionResult.status = FAILED;
            break;
        }
        index += 1;
    }
    if (collectionResult.status === UNSUBMITTED) {
        collectionResult.status = PASSED;
    }
    collectionResult.testTime = testTime;
}
function start_run(storeData, action) {
    if (action.type !== START_RUN) return;
    const { result  } = storeData;
    result.status = UNSUBMITTED;
    result.startTime = action.startTime;
}
function end_run(storeData, action) {
    if (action.type !== END_RUN) return;
    const { result  } = storeData;
    if (result.status === CANCELLED) return;
    result.endTime = action.endTime;
    updateResultProperties(storeData);
}
function cancel_run(storeData, action) {
    if (action.type !== CANCEL_RUN) return;
    const { result  } = storeData;
    result.status = CANCELLED;
    result.endTime = action.endTime;
}
function start_collection(storeData, action) {
    if (action.type !== START_COLLECTION) return;
    const { collectionResultID , startTime  } = action;
    const collectionResult = storeData.collectionResults[collectionResultID];
    if (collectionResult === undefined) {
        return;
    }
    collectionResult.status = UNSUBMITTED;
    collectionResult.startTime = startTime;
}
function end_collection(storeData, action) {
    if (action.type !== END_COLLECTION) return;
    const { collectionResultID , endTime  } = action;
    const collectionResult = storeData.collectionResults[collectionResultID];
    if (collectionResult === undefined) {
        return;
    }
    collectionResult.endTime = endTime;
    updateCollectionResult(storeData, collectionResult);
}
function start_test(storeData, action) {
    if (action.type !== START_TEST) return;
    const { testResultID , startTime  } = action;
    const testResult = storeData.testResults[testResultID];
    if (testResult === undefined) {
        return;
    }
    testResult.status = UNSUBMITTED;
    testResult.startTime = startTime;
}
function end_test(storeData, action) {
    if (action.type !== END_TEST) return;
    const { testResultID  } = action;
    const testResult = storeData.testResults[testResultID];
    if (testResult === undefined) {
        return;
    }
    const { assertions , endTime  } = action;
    testResult.assertions = assertions;
    testResult.endTime = endTime;
    testResult.status = assertions.length === 0 ? PASSED : FAILED;
}
const reactions = {
    start_run,
    end_run,
    cancel_run,
    start_collection,
    end_collection,
    start_test,
    end_test
};
function createInitialData() {
    return {
        testResults: [],
        collectionResults: [],
        result: {
            status: UNSUBMITTED,
            endTime: 0,
            startTime: 0,
            testTime: 0
        },
        tests: []
    };
}
const createTestResults = (storeData, tests)=>{
    const startIndex = storeData.testResults.length;
    for (const test of tests){
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
            testID
        });
    }
    const endIndex = storeData.testResults.length;
    return [
        startIndex,
        endIndex
    ];
};
const createCollectionResults = (storeData, collections)=>{
    for (const collection of collections){
        const collectionResultID = storeData.collectionResults.length;
        const { tests , title , runTestsAsynchronously , timeoutInterval  } = collection;
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
            title
        });
    }
};
class Store {
    data = createInitialData();
    callback;
    setup(run, callback) {
        createCollectionResults(this.data, run);
        this.callback = callback;
    }
    teardown() {
        this.callback = undefined;
    }
    dispatch(action) {
        const reaction = reactions[action.type];
        if (reaction === undefined) return;
        reaction(this.data, action);
        this.callback?.(this.data, action);
    }
}
export { Runner as Jackrabbit };
export { Store as Store };
