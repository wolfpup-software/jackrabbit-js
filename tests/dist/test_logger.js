class TestLogger {
    cancelled;
    has_failed = false;
    log(_testModule, action) {
        if (hasTestFailed(action)) {
            this.has_failed = true;
        }
    }
}
function hasTestFailed(action) {
    if ("end_test" !== action.type)
        return false;
    if (action.assertions === undefined)
        return false;
    if (Array.isArray(action.assertions) && action.assertions.length === 0)
        return false;
    return true;
}
export { TestLogger };
