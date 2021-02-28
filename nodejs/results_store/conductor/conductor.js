"use strict";
// jackrabbit
// brian taylor vann
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = void 0;
const state_store_1 = require("../state_store/state_store");
const publisher_1 = require("../publisher/publisher");
const START_TEST_RUN = "START_TEST_RUN";
const START_TEST_COLLECTION = "START_TEST_COLLECTION";
const START_TEST = "START_TEST";
const CANCEL_RUN = "CANCEL_RUN";
const END_TEST = "END_TEST";
const END_TEST_COLLECTION = "END_TEST_COLLECTION";
const END_TEST_RUN = "END_TEST_RUN";
const consolidate = (action) => {
    switch (action.action) {
        case START_TEST_RUN:
            state_store_1.buildResults(action.params);
            break;
        case START_TEST_COLLECTION:
            state_store_1.startTestCollection(action.params);
            break;
        case START_TEST:
            state_store_1.startTest(action.params);
            break;
        case CANCEL_RUN:
            state_store_1.cancelRun(action.params);
            break;
        case END_TEST:
            state_store_1.endTest(action.params);
            break;
        case END_TEST_COLLECTION:
            state_store_1.endTestCollection(action.params);
            break;
        case END_TEST_RUN:
            state_store_1.endTestRun(action.params);
            break;
        default:
            break;
    }
    publisher_1.broadcast(state_store_1.getResults());
};
const dispatch = (action) => {
    consolidate(action);
};
exports.dispatch = dispatch;
