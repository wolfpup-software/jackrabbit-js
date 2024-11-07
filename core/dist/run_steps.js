const TIMEOUT_INTERVAL = 10000;
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
async function createTimeout(timeoutInterval) {
    const interval = timeoutInterval === -1 ? TIMEOUT_INTERVAL : timeoutInterval;
    await sleep(interval);
    return `timed out at: ${interval}`;
}
async function execTest(testModules, logger, moduleId, testId) {
    if (logger.cancelled)
        return;
    logger.log(testModules, {
        type: "start_test",
        time: performance.now(),
        testId,
        moduleId,
    });
    const { tests, options } = testModules[moduleId];
    const testFunc = tests[testId];
    const startTime = performance.now();
    const assertions = await Promise.race([
        createTimeout(options?.timeoutInterval ?? TIMEOUT_INTERVAL),
        testFunc(),
    ]);
    const endTime = performance.now();
    if (logger.cancelled)
        return;
    logger.log(testModules, {
        type: "end_test",
        testId,
        moduleId,
        assertions,
        endTime,
        startTime,
    });
}
async function execCollection(testModules, logger, moduleId) {
    if (logger.cancelled)
        return;
    const { tests } = testModules[moduleId];
    const wrappedTests = [];
    for (let testId = 0; testId < tests.length; testId++) {
        wrappedTests.push(execTest(testModules, logger, moduleId, testId));
    }
    if (logger.cancelled)
        return;
    await Promise.all(wrappedTests);
}
async function execCollectionOrdered(testModules, logger, moduleId) {
    const { tests } = testModules[moduleId];
    for (let index = 0; index < tests.length; index++) {
        if (logger.cancelled)
            return;
        await execTest(testModules, logger, moduleId, index);
    }
}
async function startRun(logger, testModules) {
    if (logger.cancelled)
        return;
    logger.log(testModules, {
        type: "start_run",
        time: performance.now(),
    });
    for (let [moduleId, testModule] of testModules.entries()) {
        if (logger.cancelled)
            return;
        logger.log(testModules, {
            type: "start_module",
            time: performance.now(),
            moduleId,
        });
        const { options } = testModule;
        options?.runAsynchronously
            ? await execCollection(testModules, logger, moduleId)
            : await execCollectionOrdered(testModules, logger, moduleId);
        if (logger.cancelled)
            return;
        logger.log(testModules, {
            type: "end_module",
            time: performance.now(),
            moduleId,
        });
    }
    if (logger.cancelled)
        return;
    logger.log(testModules, {
        type: "end_run",
        time: performance.now(),
    });
}
function cancelRun(logger, testModules) {
    if (logger.cancelled)
        return;
    logger.log(testModules, {
        type: "cancel_run",
        time: performance.now(),
    });
}
export { startRun, cancelRun };
