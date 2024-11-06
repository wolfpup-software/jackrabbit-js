import * as FailTests from "./test_fail.test.js";
import * as PassTests from "./test_pass.test.js";

import type {
  LoggerAction,
  LoggerInterface,
  TestModule,
} from "../../core/dist/mod.js";

import { startRun } from "../../core/dist/mod.js";

class TestLogger implements LoggerInterface {
  cancelled: boolean;
  has_failed: boolean = false;

  log(_testModule: TestModule[], action: LoggerAction) {
    if (hasTestFailed(action)) {
      this.has_failed = true;
    }
  }

  get result(): boolean {
    return this.has_failed;
  }
}

function hasTestFailed(action: LoggerAction) {
  if ("end_test" !== action.type) return false;

  if (action.assertions === undefined) return false;
  if (Array.isArray(action.assertions) && action.assertions.length === 0)
    return false;

  return true;
}

// Test pass and fail behavior

const failTestModules = [FailTests];
const passTestModules = [PassTests];

async function testsFail() {
  let logger = new TestLogger();
  await startRun(logger, failTestModules);

  if (!logger.has_failed) return "fail tests failed to fail";
}

async function testsPass() {
  let logger = new TestLogger();
  await startRun(logger, passTestModules);

  if (logger.has_failed) return "passing tests failed to pass";
}

const tests = [testsFail, testsPass];

const options = {
  title: import.meta.url,
};

const testModule = {
  tests,
  options,
};

export const testModules = [testModule];
