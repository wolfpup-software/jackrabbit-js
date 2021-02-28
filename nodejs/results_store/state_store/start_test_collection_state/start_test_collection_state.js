"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTestCollectionState = void 0;
const startTestCollectionState = (runResults, params) => {
    var _a;
    if (runResults.results === undefined) {
        return runResults;
    }
    const { startTime, collectionID } = params;
    const collectionResult = (_a = runResults === null || runResults === void 0 ? void 0 : runResults.results) === null || _a === void 0 ? void 0 : _a[collectionID];
    if (collectionResult) {
        collectionResult.status = "submitted";
        collectionResult.startTime = startTime;
    }
    return runResults;
};
exports.startTestCollectionState = startTestCollectionState;
