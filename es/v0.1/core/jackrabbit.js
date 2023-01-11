// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const PENDING = "pending";
const UNSUBMITTED = "unsubmitted";
const CANCELLED = "cancelled";
const PASSED = "passed";
const FAILED = "failed";
const START_RUN = "start_run";
const END_RUN = "end_run";
const CANCEL_RUN = "cancel_run";
const START_COLLECTION = "start_collection";
const END_COLLECTION = "end_collection";
const START_TEST = "start_test";
const END_TEST = "end_test";
class Store {
    cancelled = true;
    collections;
    logger;
    constructor(collections, logger){
        this.collections = collections;
        this.logger = logger;
    }
    dispatch(action) {
        if (this.cancelled) return;
        if (action.type === "cancel_run") {
            this.cancelled = true;
        }
        this.logger.log(action);
    }
}
export { CANCEL_RUN as CANCEL_RUN, CANCELLED as CANCELLED, END_COLLECTION as END_COLLECTION, END_RUN as END_RUN, END_TEST as END_TEST, FAILED as FAILED, PASSED as PASSED, PENDING as PENDING, START_COLLECTION as START_COLLECTION, START_RUN as START_RUN, START_TEST as START_TEST, UNSUBMITTED as UNSUBMITTED };
export { Store as Store };
