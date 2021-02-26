// brian taylor vann
import { dispatch } from "../../results_store/results_store";
// run tests
const startTestRun = (params) => {
    dispatch({
        action: "START_TEST_RUN",
        params,
    });
};
const startTestCollection = (params) => {
    dispatch({
        action: "START_TEST_COLLECTION",
        params,
    });
};
const startTest = (params) => {
    dispatch({
        action: "START_TEST",
        params,
    });
};
const cancelRun = (params) => {
    dispatch({
        action: "CANCEL_RUN",
        params,
    });
};
const sendTestResult = (params) => {
    dispatch({
        action: "END_TEST",
        params,
    });
};
const endTestCollection = (params) => {
    dispatch({
        action: "END_TEST_COLLECTION",
        params,
    });
};
const endTestRun = (params) => {
    dispatch({
        action: "END_TEST_RUN",
        params,
    });
};
export { startTestRun, startTestCollection, startTest, cancelRun, sendTestResult, endTestCollection, endTestRun, };
