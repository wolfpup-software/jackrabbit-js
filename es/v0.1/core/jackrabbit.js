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
const createWrappedTest = async (collections, logger, collectionId, testId)=>{
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: START_TEST,
        testId,
        collectionId,
        time: performance.now()
    });
    const testFunc = collections[collectionId].tests[testId];
    const startTime = performance.now();
    const assertions = await Promise.race([
        createTimeout(collections[collectionId].timeoutInterval),
        testFunc()
    ]);
    const endTime = performance.now();
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: END_TEST,
        testId,
        collectionId,
        assertions,
        endTime,
        startTime
    });
};
function runIsCancelled(logger) {
    return logger.cancelled;
}
async function execTest(collections, logger, collectionId, testId) {
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: START_TEST,
        time: performance.now(),
        testId,
        collectionId
    });
    const testFunc = collections[collectionId].tests[testId];
    const startTime = performance.now();
    const assertions = await Promise.race([
        createTimeout(collections[collectionId].timeoutInterval),
        testFunc()
    ]);
    const endTime = performance.now();
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: END_TEST,
        testId,
        collectionId,
        assertions,
        endTime,
        startTime
    });
}
async function execCollection(collections, logger, collectionId) {
    const wrappedTests = [];
    let testId = 0;
    const length = collections[collectionId].tests.length;
    while(testId < length){
        wrappedTests.push(createWrappedTest(collections, logger, collectionId, testId));
    }
    await Promise.all(wrappedTests);
}
async function execCollectionOrdered(collections, logger, collectionId) {
    let index = 0;
    while(index < collections[collectionId].tests.length){
        if (runIsCancelled(logger)) return;
        await execTest(collections, logger, collectionId, index);
        index += 1;
    }
}
async function execRun(collections, logger) {
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: START_RUN,
        time: performance.now()
    });
    let collectionId = 0;
    while(collectionId < collections.length){
        if (runIsCancelled(logger)) return;
        logger.log(collections, {
            type: START_COLLECTION,
            time: performance.now(),
            collectionId
        });
        const collection = collections[collectionId];
        collection.runTestsAsynchronously ? await execCollection(collections, logger, collectionId) : await execCollectionOrdered(collections, logger, collectionId);
        if (runIsCancelled(logger)) return;
        logger.log(collections, {
            type: END_COLLECTION,
            time: performance.now(),
            collectionId
        });
        collectionId += 1;
    }
    if (runIsCancelled(logger)) return;
    logger.log(collections, {
        type: END_RUN,
        time: performance.now()
    });
}
function cancelRun(collections, logger) {
    logger.log(collections, {
        type: CANCEL_RUN,
        time: performance.now()
    });
}
export { CANCEL_RUN as CANCEL_RUN, CANCELLED as CANCELLED, END_COLLECTION as END_COLLECTION, END_RUN as END_RUN, END_TEST as END_TEST, FAILED as FAILED, PASSED as PASSED, PENDING as PENDING, START_COLLECTION as START_COLLECTION, START_RUN as START_RUN, START_TEST as START_TEST, UNSUBMITTED as UNSUBMITTED };
export { cancelRun as cancelRun, execRun as execRun };
