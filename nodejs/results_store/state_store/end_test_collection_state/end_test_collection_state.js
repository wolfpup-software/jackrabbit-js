"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTestCollectionState = void 0;
const allTestsHavePassed = (testResults) => {
    for (const result of testResults) {
        if (result.status !== "passed") {
            return false;
        }
    }
    return true;
};
const endTestCollectionState = (runResults, params) => {
    if (runResults.results === undefined) {
        return runResults;
    }
    const { endTime, collectionID } = params;
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
exports.endTestCollectionState = endTestCollectionState;
