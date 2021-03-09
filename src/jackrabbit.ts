// brian taylor vann
// jackrabbit

// Create and run tests.

import type { TestCollection, TestParams } from "./runner/runner.ts";
import type { TestRunResults } from "./results_store/results_store.ts";

import { runTests } from "./runner/runner.ts";
import { getResults, subscribe } from "./results_store/results_store.ts";
import { samestuff } from "./samestuff/samestuff.ts";

export type { TestCollection, TestParams, TestRunResults };

export { getResults, runTests, subscribe, samestuff };
