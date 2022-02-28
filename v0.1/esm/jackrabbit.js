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
        for (const subscription of this.subscriptions.values()){
            subscription(message);
        }
    }
}
const PENDING = "pending";
const SUBMITTED = "submitted";
const CANCELLED = "cancelled";
class Store {
    unitTests = [];
    testResults = [];
    collectionResults = [];
    runResults = [];
    runIsCancelled(receipt) {
        const run = this.runResults[receipt];
        if (run === undefined) {
            return true;
        }
        return run.status === CANCELLED;
    }
}
class Actions {
    broadcaster;
    store;
    constructor(store, broadcaster){
        this.broadcaster = broadcaster;
        this.store = store;
    }
    startRun(runID, startTime) {
        const run = this.store.runResults[runID];
        if (run === undefined) {
            return;
        }
        run.status = SUBMITTED;
        run.startTime = startTime;
    }
    endRun(runID, endTime) {
        const run = this.store.runResults[runID];
        if (run === undefined || run.status === CANCELLED) {
            return;
        }
        run.endTime = endTime;
    }
    cancelRun(runID, endTime) {
        const run = this.store.runResults[runID];
        if (run === undefined) {
            return;
        }
        run.endTime = endTime;
        run.status = CANCELLED;
    }
    startCollection(collectionID, startTime) {
        const collection = this.store.collectionResults[collectionID];
        if (collection === undefined) {
            return;
        }
        collection.status = SUBMITTED;
        collection.startTime = startTime;
    }
    endCollection(collectionID, endTime) {
        const collection = this.store.collectionResults[collectionID];
        if (collection === undefined) {
            return;
        }
        collection.endTime = endTime;
    }
    startUnitTest(unitTestID, startTime) {
        const collection = this.store.testResults[unitTestID];
        if (collection === undefined) {
            return;
        }
        collection.status = SUBMITTED;
        collection.startTime = startTime;
    }
    endUnitTest(assertions, unitTestID, endTime) {
        const unitTest = this.store.testResults[unitTestID];
        if (unitTest === undefined) {
            return;
        }
        unitTest.assertions = assertions;
        unitTest.endTime = endTime;
    }
    buildRun(run) {
        const id = this.store.runResults.length;
        const indices = this.createCollectionResults(run);
        this.store.runResults.push({
            status: SUBMITTED,
            endTime: -1,
            startTime: -1,
            id,
            indices
        });
        return id;
    }
    createUnitTestResults(tests) {
        const startIndex = this.store.testResults.length;
        for (const test of tests){
            const testID = this.store.unitTests.length;
            this.store.unitTests.push(test);
            const id = this.store.testResults.length;
            this.store.testResults.push({
                assertions: [],
                endTime: -1,
                name: test.name,
                startTime: -1,
                status: PENDING,
                id,
                testID
            });
        }
        const endIndex = this.store.testResults.length;
        return [
            startIndex,
            endIndex
        ];
    }
    createCollectionResults(collections) {
        const startIndex = this.store.collectionResults.length;
        for (const collection of collections){
            const id = this.store.collectionResults.length;
            const { tests , title , runTestsAsynchronously , timeoutInterval  } = collection;
            const indices = this.createUnitTestResults(tests);
            this.store.collectionResults.push({
                endTime: -1,
                testTime: -1,
                startTime: -1,
                status: PENDING,
                id,
                indices,
                timeoutInterval,
                runTestsAsynchronously,
                title
            });
        }
        const endIndex = this.store.testResults.length - 1;
        return [
            startIndex,
            endIndex
        ];
    }
}
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
class Actions1 {
    store;
    storeActions;
    constructor(store, storeActions){
        this.store = store;
        this.storeActions = storeActions;
    }
    async execResult(receipt) {
        const runResult = this.store.runResults[receipt];
        if (runResult === undefined) {
            return;
        }
        const { indices , id  } = runResult;
        this.storeActions.startRun(id, performance.now());
        const dest = indices[1];
        let target = indices[0];
        while(target < dest){
            if (this.store.runIsCancelled(receipt)) {
                return;
            }
            const collection = this.store.collectionResults[target];
            if (collection !== undefined) {
                collection.runTestsAsynchronously ? await this.execCollection(receipt, collection) : await this.execCollectionOrdered(receipt, collection);
            }
            target += 1;
        }
        if (this.store.runIsCancelled(receipt)) {
            return;
        }
        this.storeActions.endRun(id, performance.now());
    }
    async execUnitTest(runreceipt, testResult, timeoutInterval) {
        const { testID  } = testResult;
        this.storeActions.startUnitTest(testID, performance.now());
        const testFunc = this.store.unitTests[testID];
        const assertions = testFunc !== undefined ? await Promise.race([
            createTimeout(timeoutInterval),
            testFunc(), 
        ]) : [];
        if (this.store.runIsCancelled(runreceipt)) return;
        this.storeActions.endUnitTest(assertions, testID, performance.now());
    }
    async execCollection(runreceipt, collectionResuilt) {
        const { indices , id , timeoutInterval  } = collectionResuilt;
        const tests = [];
        let target = indices[0];
        const dest = indices[1];
        while(target <= dest){
            const testResult = this.store.testResults[target];
            if (testResult !== undefined) {
                tests.push(this.execUnitTest(runreceipt, testResult, timeoutInterval));
            }
            target += 1;
        }
        this.storeActions.startCollection(id, performance.now());
        await Promise.all(tests);
        if (this.store.runIsCancelled(runreceipt)) return;
        this.storeActions.endCollection(id, performance.now());
    }
    async execCollectionOrdered(runreceipt, collectionResuilt) {
        const { indices , id , timeoutInterval  } = collectionResuilt;
        let target = indices[0];
        const dest = indices[1];
        this.storeActions.startCollection(id, performance.now());
        while(target < dest){
            if (this.store.runIsCancelled(runreceipt)) return;
            const testResult = this.store.testResults[target];
            if (testResult !== undefined) {
                await this.execUnitTest(runreceipt, testResult, timeoutInterval);
            }
            target += 1;
        }
        if (this.store.runIsCancelled(runreceipt)) return;
        this.storeActions.endCollection(id, performance.now());
    }
}
class Runner {
    broadcaster = new Broadcaster();
    store = new Store();
    storeActions = new Actions(this.store, this.broadcaster);
    runnerActions = new Actions1(this.store, this.storeActions);
    startRun(run) {
        const receipt = this.storeActions.buildRun(run);
        this.runnerActions.execResult(receipt);
        return receipt;
    }
    cancelRun(receipt) {
        this.storeActions.cancelRun(receipt, performance.now());
    }
    subscribe(subscription) {
        return this.broadcaster.subscribe(subscription);
    }
    unsubscribe(receipt) {
        return this.broadcaster.unsubscribe(receipt);
    }
}
export { Runner as Jackrabbit };
