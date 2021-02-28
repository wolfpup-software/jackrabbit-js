"use strict";
// brian taylor vann
Object.defineProperty(exports, "__esModule", { value: true });
exports.endTestRun = exports.endTestCollection = exports.sendTestResult = exports.cancelRun = exports.startTest = exports.startTestCollection = exports.startTestRun = void 0;
const results_store_1 = require("../../results_store/results_store");
// run tests
const startTestRun = (params) => {
    results_store_1.dispatch({
        action: "START_TEST_RUN",
        params,
    });
};
exports.startTestRun = startTestRun;
const startTestCollection = (params) => {
    results_store_1.dispatch({
        action: "START_TEST_COLLECTION",
        params,
    });
};
exports.startTestCollection = startTestCollection;
const startTest = (params) => {
    results_store_1.dispatch({
        action: "START_TEST",
        params,
    });
};
exports.startTest = startTest;
const cancelRun = (params) => {
    results_store_1.dispatch({
        action: "CANCEL_RUN",
        params,
    });
};
exports.cancelRun = cancelRun;
const sendTestResult = (params) => {
    results_store_1.dispatch({
        action: "END_TEST",
        params,
    });
};
exports.sendTestResult = sendTestResult;
const endTestCollection = (params) => {
    results_store_1.dispatch({
        action: "END_TEST_COLLECTION",
        params,
    });
};
exports.endTestCollection = endTestCollection;
const endTestRun = (params) => {
    results_store_1.dispatch({
        action: "END_TEST_RUN",
        params,
    });
};
exports.endTestRun = endTestRun;
