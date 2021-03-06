const START_TEST_RUN = "START_TEST_RUN";
const START_TEST_COLLECTION = "START_TEST_COLLECTION";
const START_TEST = "START_TEST";
const CANCEL_RUN = "CANCEL_RUN";
const END_TEST = "END_TEST";
const END_TEST_COLLECTION = "END_TEST_COLLECTION";
const END_TEST_RUN = "END_TEST_RUN";
const buildResultsState = ({ testCollection , startTime ,  })=>{
    const nextState = {
        status: "submitted",
        results: [],
        startTime
    };
    for (const collection of testCollection){
        const { tests , title  } = collection;
        const collectionResults = {
            title,
            status: "unsubmitted"
        };
        const results = [];
        for (const test of tests){
            const { name  } = test;
            results.push({
                status: "unsubmitted",
                name
            });
        }
        if (nextState.results) {
            nextState.results.push({
                ...collectionResults,
                ...{
                    results
                }
            });
        }
    }
    return nextState;
};
const buildResultsState1 = buildResultsState;
const defaultResultsState = {
    status: "unsubmitted"
};
let resultsState = {
    ...defaultResultsState
};
const buildResults = (params)=>{
    resultsState = buildResultsState1(params);
};
const copycopy = (atomToCopy)=>{
    if (atomToCopy instanceof Object === false) {
        return atomToCopy;
    }
    const entries = Array.isArray(atomToCopy) ? [
        ...atomToCopy
    ] : {
        ...atomToCopy
    };
    for(const index in entries){
        const entry = entries[index];
        if (entries instanceof Object) {
            entries[index] = copycopy(entry);
        }
    }
    return entries;
};
const startTestCollectionState = (runResults, params)=>{
    if (runResults.results === undefined) {
        return runResults;
    }
    const { startTime , collectionID  } = params;
    const collectionResult = runResults?.results?.[collectionID];
    if (collectionResult) {
        collectionResult.status = "submitted";
        collectionResult.startTime = startTime;
    }
    return runResults;
};
const startTestCollectionState1 = startTestCollectionState;
const startTestCollection = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = startTestCollectionState1(copyOfResults, params);
};
const startTestState = (runResults, params)=>{
    if (runResults.results === undefined) {
        return runResults;
    }
    const { startTime , collectionID , testID  } = params;
    const testResult = runResults?.results?.[collectionID]?.results?.[testID];
    if (testResult) {
        testResult.status = "submitted";
        testResult.startTime = startTime;
    }
    return runResults;
};
const startTestState1 = startTestState;
const startTest = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = startTestState1(copyOfResults, params);
};
const cancelRunState = (runResults, params)=>{
    const { endTime  } = params;
    runResults.endTime = endTime;
    runResults.status = "cancelled";
    const collectionResults = runResults.results;
    if (collectionResults) {
        for (const collection of collectionResults){
            if (collection.status === "submitted") {
                collection.status = "cancelled";
            }
            const testResults = collection.results;
            if (testResults) {
                for (const result of testResults){
                    if (result.status === "submitted") {
                        result.status = "cancelled";
                    }
                }
            }
        }
    }
    return runResults;
};
const cancelRunState1 = cancelRunState;
const cancelRun = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = cancelRunState1(copyOfResults, params);
};
const endTestState = (runResults, params)=>{
    if (runResults.results === undefined) {
        return runResults;
    }
    const { assertions , endTime , collectionID , testID  } = params;
    const testResult = runResults?.results?.[collectionID]?.results?.[testID];
    if (testResult === undefined) {
        return runResults;
    }
    testResult.status = "failed";
    if (assertions === undefined) {
        testResult.status = "passed";
    }
    if (assertions && assertions.length === 0) {
        testResult.status = "passed";
    }
    testResult.assertions = assertions;
    testResult.endTime = endTime;
    return runResults;
};
const endTestState1 = endTestState;
const endTest = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestState1(copyOfResults, params);
};
const allTestsHavePassed = (testResults)=>{
    for (const result of testResults){
        if (result.status !== "passed") {
            return false;
        }
    }
    return true;
};
const endTestCollectionState = (runResults, params)=>{
    if (runResults.results === undefined) {
        return runResults;
    }
    const { endTime , collectionID  } = params;
    const collection = runResults.results[collectionID];
    if (collection === undefined) {
        return runResults;
    }
    collection.endTime = endTime;
    collection.status = "failed";
    const collectionResults = collection.results;
    if (collectionResults && allTestsHavePassed(collectionResults)) {
        collection.status = "passed";
    }
    return runResults;
};
const endTestCollectionState1 = endTestCollectionState;
const endTestCollection = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestCollectionState1(copyOfResults, params);
};
const allTestCollectionsHavePassed = (collectionResults)=>{
    for (const collection of collectionResults){
        if (collection.status === "failed") {
            return false;
        }
    }
    return true;
};
const endTestRunState = (runResults, params)=>{
    const { endTime  } = params;
    runResults.endTime = endTime;
    runResults.status = "failed";
    const results = runResults.results;
    if (results && allTestCollectionsHavePassed(results)) {
        runResults.status = "passed";
    }
    return runResults;
};
const endTestRunState1 = endTestRunState;
const endTestRun = (params)=>{
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestRunState1(copyOfResults, params);
};
const getResults1 = ()=>{
    return copycopy(resultsState);
};
class PubSub {
    stub = 0;
    recycledStubs = [];
    subscriptions = {
    };
    getStub() {
        const stub = this.recycledStubs.pop();
        if (stub !== undefined) {
            return stub;
        }
        this.stub += 1;
        return this.stub;
    }
    subscribe(callback) {
        const stub = this.getStub();
        this.subscriptions[stub] = callback;
        return stub;
    }
    unsubscribe(stub) {
        if (this.subscriptions[stub] != undefined) {
            this.subscriptions[stub] = undefined;
            this.recycledStubs.push(stub);
        }
    }
    broadcast(params) {
        for(const stubKey in this.subscriptions){
            const subscription = this.subscriptions[stubKey];
            if (subscription !== undefined) {
                subscription(params);
            }
        }
    }
}
const pubSub = new PubSub();
const subscribe1 = (resultsCallback)=>{
    const stub = pubSub.subscribe(resultsCallback);
    return ()=>{
        pubSub.unsubscribe(stub);
    };
};
const broadcast = (testRunState)=>{
    pubSub.broadcast(testRunState);
};
const consolidate = (action)=>{
    switch(action.action){
        case START_TEST_RUN:
            buildResults(action.params);
            break;
        case START_TEST_COLLECTION:
            startTestCollection(action.params);
            break;
        case START_TEST:
            startTest(action.params);
            break;
        case CANCEL_RUN:
            cancelRun(action.params);
            break;
        case END_TEST:
            endTest(action.params);
            break;
        case END_TEST_COLLECTION:
            endTestCollection(action.params);
            break;
        case END_TEST_RUN:
            endTestRun(action.params);
            break;
        default: break;
    }
    broadcast(getResults1());
};
const dispatch = (action)=>{
    consolidate(action);
};
const startTestRun = (params)=>{
    dispatch({
        action: "START_TEST_RUN",
        params
    });
};
const startTestCollection1 = (params)=>{
    dispatch({
        action: "START_TEST_COLLECTION",
        params
    });
};
const startTest1 = (params)=>{
    dispatch({
        action: "START_TEST",
        params
    });
};
const cancelRun1 = (params)=>{
    dispatch({
        action: "CANCEL_RUN",
        params
    });
};
const sendTestResult = (params)=>{
    dispatch({
        action: "END_TEST",
        params
    });
};
const endTestCollection1 = (params)=>{
    dispatch({
        action: "END_TEST_COLLECTION",
        params
    });
};
const endTestRun1 = (params)=>{
    dispatch({
        action: "END_TEST_RUN",
        params
    });
};
let stub = 0;
const getStub = ()=>{
    return stub;
};
const updateStub = ()=>{
    stub += 1;
    return stub;
};
const sleep = (time)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        }, time);
    });
};
const getTimeoutAssertions = (timeoutInterval)=>[
        `timed out at: ${timeoutInterval}`, 
    ]
;
const createTestTimeout = async (timeoutInterval)=>{
    const interval = timeoutInterval ?? 10000;
    await sleep(interval);
    return getTimeoutAssertions(interval);
};
const buildTest = (params)=>{
    const { issuedAt , testID , collectionID , timeoutInterval  } = params;
    return async ()=>{
        if (issuedAt < getStub()) {
            return;
        }
        const startTime = Date.now();
        startTest1({
            collectionID,
            testID,
            startTime
        });
        const assertions = await Promise.race([
            params.testFunc(),
            createTestTimeout(timeoutInterval), 
        ]);
        if (issuedAt < getStub()) {
            return;
        }
        const endTime = Date.now();
        sendTestResult({
            endTime,
            assertions,
            collectionID,
            testID
        });
    };
};
const runTestsAllAtOnce = async ({ startTime , collectionID , tests , timeoutInterval ,  })=>{
    const builtAsyncTests = [];
    let testID = 0;
    for (const testFunc of tests){
        builtAsyncTests.push(buildTest({
            collectionID,
            issuedAt: startTime,
            testFunc,
            testID,
            timeoutInterval
        })());
        testID += 1;
    }
    if (startTime < getStub()) {
        return;
    }
    await Promise.all(builtAsyncTests);
};
const runTestsInOrder = async ({ startTime , collectionID , tests , timeoutInterval ,  })=>{
    let testID = 0;
    for (const testFunc of tests){
        if (startTime < getStub()) {
            return;
        }
        const builtTest = buildTest({
            collectionID,
            issuedAt: startTime,
            testFunc,
            testID,
            timeoutInterval
        });
        await builtTest();
        testID += 1;
    }
};
const startLtrTestCollectionRun = async ({ testCollection , startTime , stub: stub1 ,  })=>{
    startTestRun({
        testCollection,
        startTime,
        stub: stub1
    });
    let collectionID = 0;
    for (const collection of testCollection){
        if (stub1 < getStub()) {
            return;
        }
        const { tests , runTestsAsynchronously , timeoutInterval  } = collection;
        const runParams = {
            collectionID,
            tests,
            startTime,
            timeoutInterval
        };
        startTestCollection1({
            collectionID,
            startTime
        });
        if (runTestsAsynchronously) {
            await runTestsAllAtOnce(runParams);
        } else {
            await runTestsInOrder(runParams);
        }
        if (stub1 < getStub()) {
            return;
        }
        const endTime = Date.now();
        endTestCollection1({
            collectionID,
            endTime
        });
        collectionID += 1;
    }
    if (stub1 < getStub()) {
        return;
    }
    const endTime = Date.now();
    endTestRun1({
        endTime
    });
};
const runTests1 = async (params)=>{
    const startTime = Date.now();
    const stub1 = updateStub();
    await startLtrTestCollectionRun({
        ...params,
        ...{
            startTime,
            stub: stub1
        }
    });
    if (stub1 < getStub()) {
        return;
    }
    return getResults1();
};
const samestuff1 = (source, comparator)=>{
    if (source === null || comparator === null) {
        return source === comparator;
    }
    const isSourceObject = source instanceof Object;
    const isComparatorObject = comparator instanceof Object;
    if (!isSourceObject || !isComparatorObject) {
        return source === comparator;
    }
    const isSourceFunc = source instanceof Function;
    const isComparatorFunc = comparator instanceof Function;
    if (isSourceFunc || isComparatorFunc) {
        return source === comparator;
    }
    const isSourceArray = source instanceof Array;
    const isComparatorArray = comparator instanceof Array;
    if (isSourceArray !== isComparatorArray) {
        return source === comparator;
    }
    if (source instanceof Object && comparator instanceof Object) {
        for(const sourceKey in source){
            const typedSourceKey = sourceKey;
            const nextSource = source[typedSourceKey];
            const nextComparator = comparator[typedSourceKey];
            if (!samestuff1(nextSource, nextComparator)) {
                return false;
            }
        }
        for(const comparatorKey in comparator){
            const typedComparatorKey = comparatorKey;
            const nextComparator = comparator[typedComparatorKey];
            const nextSource = source[typedComparatorKey];
            if (!samestuff1(nextComparator, nextSource)) {
                return false;
            }
        }
    }
    return true;
};
export { getResults1 as getResults, runTests1 as runTests, subscribe1 as subscribe, samestuff1 as samestuff };
