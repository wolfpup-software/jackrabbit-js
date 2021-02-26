const endTestState = (runResults, params) => {
    var _a, _b, _c;
    if (runResults.results === undefined) {
        return runResults;
    }
    const { assertions, endTime, collectionID, testID } = params;
    const testResult = (_c = (_b = (_a = runResults === null || runResults === void 0 ? void 0 : runResults.results) === null || _a === void 0 ? void 0 : _a[collectionID]) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c[testID];
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
export { endTestState };
