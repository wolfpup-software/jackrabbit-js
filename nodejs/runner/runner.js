"use strict";
// brian taylor vann
// jackrabbit
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRun = exports.runTests = void 0;
const results_store_1 = require("../results_store/results_store");
const relay_results_1 = require("./relay_results/relay_results");
Object.defineProperty(exports, "cancelRun", { enumerable: true, get: function () { return relay_results_1.cancelRun; } });
const receipt_1 = require("./receipt/receipt");
const run_tests_1 = require("./run_tests/run_tests");
const get_now_as_milliseconds_1 = require("./get_now_as_milliseconds/get_now_as_milliseconds");
// create a test collection
const startLtrTestCollectionRun = ({ testCollection, startTime, stub, }) => __awaiter(void 0, void 0, void 0, function* () {
    relay_results_1.startTestRun({ testCollection, startTime, stub });
    let collectionID = 0;
    for (const collection of testCollection) {
        if (stub < receipt_1.getStub()) {
            return;
        }
        const { tests, runTestsAsynchronously, timeoutInterval } = collection;
        const runParams = {
            collectionID,
            tests,
            startTime,
            timeoutInterval,
        };
        relay_results_1.startTestCollection({
            collectionID,
            startTime,
        });
        if (runTestsAsynchronously) {
            yield run_tests_1.runTestsAllAtOnce(runParams);
        }
        else {
            yield run_tests_1.runTestsInOrder(runParams);
        }
        if (stub < receipt_1.getStub()) {
            return;
        }
        const endTime = get_now_as_milliseconds_1.getNowAsMilliseconds();
        relay_results_1.endTestCollection({
            collectionID,
            endTime,
        });
        collectionID += 1;
    }
    if (stub < receipt_1.getStub()) {
        return;
    }
    const endTime = get_now_as_milliseconds_1.getNowAsMilliseconds();
    relay_results_1.endTestRun({ endTime });
});
// iterate through tests synchronously
const runTests = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = get_now_as_milliseconds_1.getNowAsMilliseconds();
    const stub = receipt_1.updateStub();
    yield startLtrTestCollectionRun(Object.assign(Object.assign({}, params), { startTime, stub }));
    if (stub < receipt_1.getStub()) {
        return;
    }
    return results_store_1.getResults();
});
exports.runTests = runTests;
