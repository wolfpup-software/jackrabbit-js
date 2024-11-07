class Logger {
    #assertions = new Map();
    failed = false;
    cancelled = false;
    #startTime = -1;
    #testTime = 0;
    log(testModules, action) {
        if ("start_run" === action.type) {
            this.#startTime = action.time;
        }
        if ("cancel_run" === action.type) {
            this.cancelled = true;
            logAssertions(testModules, this.#assertions);
            logCancelled(this.#startTime, this.#testTime, action.time);
        }
        //  add to fails
        if ("end_test" === action.type && action?.assertions) {
            if (Array.isArray(action.assertions) && action.assertions.length === 0)
                return;
            this.#testTime += action.endTime - action.startTime;
            this.failed = true;
            let assertions = this.#assertions.get(action.moduleId);
            if (assertions) {
                assertions.set(action.testId, action);
            }
            else {
                this.#assertions.set(action.moduleId, new Map([[action.testId, action]]));
            }
        }
        if ("end_run" === action.type) {
            logAssertions(testModules, this.#assertions);
            logResults(this.failed, this.#startTime, this.#testTime, action.time);
        }
    }
}
function logAssertions(testModules, fails) {
    for (let [index, module] of testModules.entries()) {
        const { tests, options } = module;
        console.log(`
${options?.title ?? `test index: ${index}`}`);
        let numTests = tests.length;
        let failedTests = fails.get(index);
        if (undefined === failedTests) {
            console.log(`${numTests}/${numTests} tests passed`);
            continue;
        }
        let numTestsPassed = numTests - failedTests.size;
        console.log(`${numTestsPassed}/${numTests} tests passed`);
        for (let [index, test] of tests.entries()) {
            let action = failedTests.get(index);
            if (undefined === action || action.type !== "end_test")
                continue;
            console.log(`  ${test.name}
    ${action.assertions}`);
        }
    }
}
function logCancelled(startTime, testTime, time) {
    const overhead = time - startTime;
    console.log(`
Results:
cancelled
  duration: ${testTime.toFixed(4)} mS
  overhead: ${overhead.toFixed(4)} mS`);
}
function logResults(failed, startTime, testTime, time) {
    const status = failed ? yellow("\u{2717} failed") : blue("\u{2714} passed");
    const overhead = time - startTime;
    console.log(`
Results:
${status}
    duration: ${testTime.toFixed(4)} mS
    overhead: ${overhead.toFixed(4)} mS`);
}
function blue(text) {
    return `\x1b[44m\x1b[39m${text}\x1b[0m`;
}
function yellow(text) {
    return `\x1b[43m\x1b[39m${text}\x1b[0m`;
}
export { Logger };
