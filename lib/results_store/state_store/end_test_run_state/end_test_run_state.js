// for test collection
const allTestCollectionsHavePassed = (collectionResults) => {
    for (const collection of collectionResults) {
        if (collection.status === "failed") {
            return false;
        }
    }
    return true;
};
const endTestRunState = (runResults, params) => {
    const { endTime } = params;
    runResults.endTime = endTime;
    runResults.status = "failed";
    const results = runResults.results;
    if (results && allTestCollectionsHavePassed(results)) {
        runResults.status = "passed";
    }
    return runResults;
};
export { endTestRunState };
