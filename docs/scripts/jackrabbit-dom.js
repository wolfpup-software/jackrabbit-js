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
function runIsCancelled(store) {
    return store.data.status === CANCELLED;
}
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
    if (runIsCancelled(store)) return;
    const { testResultID  } = testResult;
    const testFunc = store.data.tests[testResultID];
    if (testFunc === undefined) return;
    store.dispatch({
        type: START_TEST,
        testResultID,
        startTime: performance.now()
    });
    const assertions = await Promise.race([
        createTimeout(timeoutInterval),
        testFunc()
    ]);
    if (runIsCancelled(store)) return;
    store.dispatch({
        type: END_TEST,
        testResultID,
        assertions,
        endTime: performance.now()
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
    store.dispatch({
        type: START_COLLECTION,
        startTime: performance.now(),
        collectionResultID
    });
    await Promise.all(tests);
    if (runIsCancelled(store)) return;
    store.dispatch({
        type: END_COLLECTION,
        endTime: performance.now(),
        collectionResultID
    });
}
async function execCollectionOrdered(store, collectionResult) {
    if (runIsCancelled(store)) return;
    const { indices , collectionResultID , timeoutInterval  } = collectionResult;
    performance.now();
    store.dispatch({
        type: START_COLLECTION,
        startTime: performance.now(),
        collectionResultID
    });
    let origin = indices[0];
    const target = indices[1];
    while(origin < target){
        if (runIsCancelled(store)) return;
        const testResult = store.data.testResults[origin];
        if (testResult !== undefined) {
            await execTest(store, testResult, timeoutInterval);
        }
        origin += 1;
    }
    performance.now();
    if (runIsCancelled(store)) return;
    store.dispatch({
        type: END_COLLECTION,
        endTime: performance.now(),
        collectionResultID
    });
}
class Runner {
    cancel(store) {
        cancelRun(store);
    }
    async run(store) {
        await execRun(store);
    }
}
function updateResultProperties(storeData) {
    let testTime = 0;
    for (const collectionResult of storeData.collectionResults){
        if (collectionResult.status === FAILED) {
            storeData.status = FAILED;
        }
        testTime += collectionResult.testTime;
    }
    if (storeData.status === UNSUBMITTED) {
        storeData.status = PASSED;
    }
    storeData.testTime = testTime;
}
function updateCollectionResult(storeData, collectionResult) {
    let { indices , startTime , endTime  } = collectionResult;
    let testTime = endTime - startTime;
    const target = indices[1];
    let index = indices[0];
    while(index < target){
        if (storeData.status === FAILED) {
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
    storeData.status = UNSUBMITTED;
    storeData.startTime = action.startTime;
}
function end_run(storeData, action) {
    if (action.type !== END_RUN) return;
    if (storeData.status === CANCELLED) return;
    storeData.endTime = action.endTime;
    updateResultProperties(storeData);
}
function cancel_run(storeData, action) {
    if (action.type !== CANCEL_RUN) return;
    storeData.status = CANCELLED;
    storeData.endTime = action.endTime;
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
        tests: [],
        testResults: [],
        collectionResults: [],
        status: UNSUBMITTED,
        endTime: 0,
        startTime: 0,
        testTime: 0
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
    data;
    logger;
    constructor(run, logger){
        this.data = createInitialData();
        this.logger = logger;
        createCollectionResults(this.data, run);
    }
    dispatch(action) {
        const reaction = reactions[action.type];
        if (reaction === undefined) return;
        reaction(this.data, action);
        this.logger.log(this.data, action);
    }
}
4;
class Importer {
    async load(filename) {
        const { tests  } = await import(filename);
        return tests;
    }
}
class Logger {
    log(data, action) {
        if (root === null) {
            return;
        }
        let message = "";
        switch(action.type){
            case "end_test":
                const testResult = data.testResults[action.testResultID];
                message = `test *${testResult.status}* in ${testResult.endTime - testResult.startTime}`;
                break;
            case "end_collection":
                const collecitonResult = data.collectionResults[action.collectionResultID];
                message = `collection *${collecitonResult.status}* in ${collecitonResult.testTime}`;
                break;
            case "end_run":
                message = `run *${data.status}* in ${data.testTime}`;
                break;
        }
        const textNode = document.createTextNode(`${action.type} : ${message}`);
        const node = document.createElement("div");
        node.appendChild(textNode);
        if (root.firstChild === null) {
            root.appendChild(node);
        } else {
            root.insertBefore(node, root.firstChild);
        }
    }
}
async function run(files, importer, logs) {
    for (const file of files){
        const tests = await importer.load(file);
        const store = new Store(tests, logs);
        const runner = new Runner();
        await runner.run(store);
    }
}
const root = document.querySelector("section");
const files = [
    "./jackrabbit.test.js"
];
const importer = new Importer();
const logger = new Logger();
run(files, importer, logger);
