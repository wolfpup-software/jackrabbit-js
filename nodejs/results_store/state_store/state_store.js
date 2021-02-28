"use strict";
// brian taylor vann
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.endTestRun = exports.endTestCollection = exports.endTest = exports.cancelRun = exports.startTest = exports.startTestCollection = exports.buildResults = void 0;
const copycopy_1 = require("../../copycopy/copycopy");
const build_state_1 = require("./build_state/build_state");
const start_test_collection_state_1 = require("./start_test_collection_state/start_test_collection_state");
const start_test_state_1 = require("./start_test_state/start_test_state");
const cancel_run_state_1 = require("./cancel_run_state/cancel_run_state");
const end_test_collection_state_1 = require("./end_test_collection_state/end_test_collection_state");
const end_test_state_1 = require("./end_test_state/end_test_state");
const end_test_run_state_1 = require("./end_test_run_state/end_test_run_state");
const defaultResultsState = {
    status: "unsubmitted",
};
let resultsState = Object.assign({}, defaultResultsState);
const buildResults = (params) => {
    resultsState = build_state_1.buildResultsState(params);
};
exports.buildResults = buildResults;
const startTestCollection = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = start_test_collection_state_1.startTestCollectionState(copyOfResults, params);
};
exports.startTestCollection = startTestCollection;
const startTest = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = start_test_state_1.startTestState(copyOfResults, params);
};
exports.startTest = startTest;
const cancelRun = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = cancel_run_state_1.cancelRunState(copyOfResults, params);
};
exports.cancelRun = cancelRun;
const endTest = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = end_test_state_1.endTestState(copyOfResults, params);
};
exports.endTest = endTest;
const endTestCollection = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = end_test_collection_state_1.endTestCollectionState(copyOfResults, params);
};
exports.endTestCollection = endTestCollection;
const endTestRun = (params) => {
    const copyOfResults = copycopy_1.copycopy(resultsState);
    resultsState = end_test_run_state_1.endTestRunState(copyOfResults, params);
};
exports.endTestRun = endTestRun;
const getResults = () => {
    return copycopy_1.copycopy(resultsState);
};
exports.getResults = getResults;
