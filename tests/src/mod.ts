import * as FailTests from "./test_fail.test.js";
import * as PassTests from "./test_fail.test.js";

import type {
  LoggerAction,
  LoggerInterface,
  Test,
  Options,
  TestModule,
} from "../../core/dist/mod.js";

import { startRun, cancelRun } from "../../core/dist/mod.js";

class TestLogger implements LoggerInterface {
  cancelled: boolean;
  #failed: boolean;

  log(_testModule: TestModule[], action: LoggerAction) {
    if (hasTestFailed(action)) {
      this.#failed = true;
    }
  }

  get result(): boolean {
    return this.#failed;
  }
}

function hasTestFailed(action: LoggerAction) {
  if ("end_test" !== action.type) return false;

  if (action.assertions === undefined) return false;
  if (Array.isArray(action.assertions) && action.assertions.length === 0)
    return false;

  return true;
}

// test logger
// look for end collection fail

const failTestModules = [FailTests];

const passTestModules = [PassTests];
// create logger and run for fail tests
// create logger and run for pass tests

// test fail tests fail

// test pass tests pass

// finally export test modules
export const testModules = [];
