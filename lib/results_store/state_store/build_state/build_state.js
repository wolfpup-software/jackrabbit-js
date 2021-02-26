const buildResultsState = ({ testCollection, startTime, stub, }) => {
    const nextState = {
        status: "submitted",
        results: [],
        startTime,
    };
    for (const collection of testCollection) {
        const { tests, title } = collection;
        const collectionResults = {
            title,
            status: "unsubmitted",
        };
        const results = [];
        for (const test of tests) {
            const { name } = test;
            results.push({
                status: "unsubmitted",
                name,
            });
        }
        if (nextState.results) {
            nextState.results.push(Object.assign(Object.assign({}, collectionResults), { results }));
        }
    }
    return nextState;
};
export { buildResultsState };
