const cancelRunState = (runResults, params) => {
    const { endTime } = params;
    runResults.endTime = endTime;
    runResults.status = "cancelled";
    const collectionResults = runResults.results;
    if (collectionResults) {
        for (const collection of collectionResults) {
            if (collection.status === "submitted") {
                collection.status = "cancelled";
            }
            const testResults = collection.results;
            if (testResults) {
                for (const result of testResults) {
                    if (result.status === "submitted") {
                        result.status = "cancelled";
                    }
                }
            }
        }
    }
    return runResults;
};
export { cancelRunState };
