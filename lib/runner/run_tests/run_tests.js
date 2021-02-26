// jackrabbit
// brian taylor vann
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { startTest, sendTestResult } from "../relay_results/relay_results";
import { getStub } from "../receipt/receipt";
const sleep = (time) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
});
const defaultTimeoutInterval = 10000;
const getTimeoutAssertions = (timeoutInterval) => [
    `timed out at: ${timeoutInterval}`,
];
const createTestTimeout = (timeoutInterval) => __awaiter(void 0, void 0, void 0, function* () {
    const interval = timeoutInterval !== null && timeoutInterval !== void 0 ? timeoutInterval : defaultTimeoutInterval;
    yield sleep(interval);
    return getTimeoutAssertions(interval);
});
const buildTest = (params) => {
    const { issuedAt, testID, collectionID, timeoutInterval } = params;
    return () => __awaiter(void 0, void 0, void 0, function* () {
        if (issuedAt < getStub()) {
            return;
        }
        const startTime = performance.now();
        startTest({
            collectionID,
            testID,
            startTime,
        });
        const assertions = yield Promise.race([
            params.testFunc(),
            createTestTimeout(timeoutInterval),
        ]);
        if (issuedAt < getStub()) {
            return;
        }
        const endTime = performance.now();
        sendTestResult({
            endTime,
            assertions,
            collectionID,
            testID,
        });
    });
};
const runTestsAllAtOnce = ({ startTime, collectionID, tests, timeoutInterval, }) => __awaiter(void 0, void 0, void 0, function* () {
    const builtAsyncTests = [];
    let testID = 0;
    for (const testFunc of tests) {
        builtAsyncTests.push(buildTest({
            collectionID,
            issuedAt: startTime,
            testFunc,
            testID,
            timeoutInterval,
        })() // execute test before push
        );
        testID += 1;
    }
    if (startTime < getStub()) {
        return;
    }
    yield Promise.all(builtAsyncTests);
});
const runTestsInOrder = ({ startTime, collectionID, tests, timeoutInterval, }) => __awaiter(void 0, void 0, void 0, function* () {
    let testID = 0;
    for (const testFunc of tests) {
        if (startTime < getStub()) {
            return;
        }
        const builtTest = buildTest({
            collectionID,
            issuedAt: startTime,
            testFunc,
            testID,
            timeoutInterval,
        });
        yield builtTest();
        testID += 1;
    }
});
export { runTestsInOrder, runTestsAllAtOnce };
