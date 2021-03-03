// brian taylor vann
// state store
import { copycopy } from "../../copycopy/copycopy";
import { buildResultsState } from "./build_state/build_state";
import { startTestCollectionState } from "./start_test_collection_state/start_test_collection_state";
import { startTestState } from "./start_test_state/start_test_state";
import { cancelRunState } from "./cancel_run_state/cancel_run_state";
import { endTestCollectionState } from "./end_test_collection_state/end_test_collection_state";
import { endTestState } from "./end_test_state/end_test_state";
import { endTestRunState } from "./end_test_run_state/end_test_run_state";
const defaultResultsState = {
    status: "unsubmitted",
};
let resultsState = Object.assign({}, defaultResultsState);
const buildResults = (params) => {
    resultsState = buildResultsState(params);
};
const startTestCollection = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = startTestCollectionState(copyOfResults, params);
};
const startTest = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = startTestState(copyOfResults, params);
};
const cancelRun = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = cancelRunState(copyOfResults, params);
};
const endTest = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestState(copyOfResults, params);
};
const endTestCollection = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestCollectionState(copyOfResults, params);
};
const endTestRun = (params) => {
    const copyOfResults = copycopy(resultsState);
    resultsState = endTestRunState(copyOfResults, params);
};
const getResults = () => {
    return copycopy(resultsState);
};
export { buildResults, cancelRun, endTest, endTestCollection, endTestRun, getResults, startTest, startTestCollection, };
