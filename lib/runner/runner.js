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
import { getResults, } from "../results_store/results_store";
import { startTestRun, startTestCollection, cancelRun, endTestCollection, endTestRun, } from "./relay_results/relay_results";
import { getStub, updateStub } from "./receipt/receipt";
import { runTestsInOrder, runTestsAllAtOnce } from "./run_tests/run_tests";
import { getNowAsMilliseconds } from "./get_now_as_milliseconds/get_now_as_milliseconds";
// create a test collection
const startLtrTestCollectionRun = ({ testCollection, startTime, stub, }) => __awaiter(void 0, void 0, void 0, function* () {
    startTestRun({ testCollection, startTime, stub });
    let collectionID = 0;
    for (const collection of testCollection) {
        if (stub < getStub()) {
            return;
        }
        const { tests, runTestsAsynchronously, timeoutInterval } = collection;
        const runParams = {
            collectionID,
            tests,
            startTime,
            timeoutInterval,
        };
        startTestCollection({
            collectionID,
            startTime,
        });
        if (runTestsAsynchronously) {
            yield runTestsAllAtOnce(runParams);
        }
        else {
            yield runTestsInOrder(runParams);
        }
        if (stub < getStub()) {
            return;
        }
        const endTime = getNowAsMilliseconds();
        endTestCollection({
            collectionID,
            endTime,
        });
        collectionID += 1;
    }
    if (stub < getStub()) {
        return;
    }
    const endTime = getNowAsMilliseconds();
    endTestRun({ endTime });
});
// iterate through tests synchronously
const runTests = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = getNowAsMilliseconds();
    const stub = updateStub();
    yield startLtrTestCollectionRun(Object.assign(Object.assign({}, params), { startTime, stub }));
    if (stub < getStub()) {
        return;
    }
    return getResults();
});
export { runTests, cancelRun };
