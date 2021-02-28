"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTestState = void 0;
const startTestState = (runResults, params) => {
    var _a, _b, _c;
    if (runResults.results === undefined) {
        return runResults;
    }
    const { startTime, collectionID, testID } = params;
    const testResult = (_c = (_b = (_a = runResults === null || runResults === void 0 ? void 0 : runResults.results) === null || _a === void 0 ? void 0 : _a[collectionID]) === null || _b === void 0 ? void 0 : _b.results) === null || _c === void 0 ? void 0 : _c[testID];
    if (testResult) {
        testResult.status = "submitted";
        testResult.startTime = startTime;
    }
    return runResults;
};
exports.startTestState = startTestState;
