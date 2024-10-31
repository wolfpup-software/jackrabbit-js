import type { Collection, LoggerAction, LoggerInterface } from "./deps.js";

import { JackrabbitError } from "./cli_types.js";

class Logger implements LoggerInterface {
  assertions: Map<number, Map<number, LoggerAction>> = new Map();
  #failed: boolean = false;
  cancelled: boolean = false;
  #startTime: number = -1;
  #testTime: number = 0;

  log(collections: Collection[], action: LoggerAction) {
    if ("start_run" === action.type) {
      this.#startTime = action.time;
    }

    if ("cancel_run" === action.type) {
      logAssertions(collections, this.assertions);
      logCancelled(this.#startTime, this.#testTime, action.time);

      throw new JackrabbitError(`Test run cancelled`);
    }

    //  add to fails
    if ("end_test" === action.type && action?.assertions) {
      if (Array.isArray(action.assertions) && action.assertions.length === 0)
        return;
      this.#testTime += action.endTime - action.startTime;
      this.#failed = true;

      let assertions = this.assertions.get(action.collectionId);
      if (assertions) {
        assertions.set(action.testId, action);
      } else {
        this.assertions.set(
          action.collectionId,
          new Map([[action.testId, action]]),
        );
      }
    }

    if ("end_run" === action.type) {
      logAssertions(collections, this.assertions);
      logResults(this.#failed, this.#startTime, this.#testTime, action.time);

      if (this.#failed) {
        throw new JackrabbitError(`Test run failed`);
      }
    }
  }
}

function logAssertions(
  collections: Collection[],
  fails: Map<number, Map<number, LoggerAction>>,
) {
  for (let [index, collection] of collections.entries()) {
    console.log(`${collection.title}`);

    let numTests = collection.tests.length;

    let failedTests = fails.get(index);
    if (undefined === failedTests) {
      console.log(`${numTests}/${numTests} tests passed`);
      continue;
    }

    let numTestsPassed = numTests - failedTests.size;
    console.log(`! ${numTestsPassed}/${numTests} tests passed`);

    for (let [index, test] of collection.tests.entries()) {
      let action = failedTests.get(index);
      if (undefined === action || action.type !== "end_test") continue;

      console.log(`  ${test.name}
    ${action.assertions}`);
    }
  }
}

function logCancelled(startTime: number, testTime: number, time: number) {
  const overhead = time - startTime;
  console.log(`
Results:
cancelled
  duration: ${testTime.toFixed(4)} mS
  overhead: ${overhead.toFixed(4)} mS`);
}

function logResults(
  failed: boolean,
  startTime: number,
  testTime: number,
  time: number,
) {
  const status = failed ? yellow("\u{2717} failed") : blue("\u{2714} passed");
  const overhead = time - startTime;
  console.log(`
Results:
${status}
    duration: ${testTime.toFixed(4)} mS
    overhead: ${overhead.toFixed(4)} mS`);
}

function blue(text: string) {
  return `\x1b[44m\x1b[39m${text}\x1b[0m`;
}

function yellow(text: string) {
  return `\x1b[43m\x1b[39m${text}\x1b[0m`;
}

export { JackrabbitError, Logger };
