// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
        `timed out at: ${interval}`
    ];
};
async function execTest(collections, logger, collectionId, testId) {
    if (logger.cancelled) return;
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
    if (logger.cancelled) return;
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
        wrappedTests.push(execTest(collections, logger, collectionId, testId));
        testId += 1;
    }
    await Promise.all(wrappedTests);
}
async function execCollectionOrdered(collections, logger, collectionId) {
    const numTests = collections[collectionId].tests.length;
    let index = 0;
    while(index < numTests){
        if (logger.cancelled) return;
        await execTest(collections, logger, collectionId, index);
        index += 1;
    }
}
async function startRun(collections, logger) {
    if (logger.cancelled) return;
    logger.log(collections, {
        type: START_RUN,
        time: performance.now()
    });
    let collectionId = 0;
    const numCollections = collections.length;
    while(collectionId < numCollections){
        if (logger.cancelled) return;
        logger.log(collections, {
            type: START_COLLECTION,
            time: performance.now(),
            collectionId
        });
        collections[collectionId].runTestsAsynchronously ? await execCollection(collections, logger, collectionId) : await execCollectionOrdered(collections, logger, collectionId);
        if (logger.cancelled) return;
        logger.log(collections, {
            type: END_COLLECTION,
            time: performance.now(),
            collectionId
        });
        collectionId += 1;
    }
    if (logger.cancelled) return;
    logger.log(collections, {
        type: END_RUN,
        time: performance.now()
    });
}
function cancelRun(collections, logger) {
    if (logger.cancelled) return;
    logger.log(collections, {
        type: CANCEL_RUN,
        time: performance.now()
    });
}
export { CANCEL_RUN as CANCEL_RUN, END_COLLECTION as END_COLLECTION, END_RUN as END_RUN, END_TEST as END_TEST, START_COLLECTION as START_COLLECTION, START_RUN as START_RUN, START_TEST as START_TEST };
export { cancelRun as cancelRun, startRun as startRun };
