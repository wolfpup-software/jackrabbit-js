"use strict";
// brian taylor vann
// jackrabbit
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResults = exports.subscribe = exports.runTests = void 0;
// Create and run tests in the browser.
// There are no dependencies.
const runner_1 = require("./runner/runner");
Object.defineProperty(exports, "runTests", { enumerable: true, get: function () { return runner_1.runTests; } });
const results_store_1 = require("./results_store/results_store");
Object.defineProperty(exports, "subscribe", { enumerable: true, get: function () { return results_store_1.subscribe; } });
Object.defineProperty(exports, "getResults", { enumerable: true, get: function () { return results_store_1.getResults; } });
