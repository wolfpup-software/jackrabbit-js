import type { Collection, LoggerAction, LoggerInterface } from "./deps.ts";

import { CANCEL_RUN, END_RUN, END_TEST, START_RUN } from "./deps.js";

import { JackrabbitError } from "./cli_types.js";

class Logger implements LoggerInterface {
  #fails: Map<number, Set<number>> = new Map();
  #failed: boolean = false;
  cancelled: boolean = false;
  #startTime: number = -1;
  #testTime: number = 0;

  log(collections: Collection[], action: LoggerAction) {
    if (action.type === START_RUN) {
      this.#startTime = action.time;
    }

    if (action.type === CANCEL_RUN) {
      logAssertions(collections, this.#fails);
      logCancelled(this.#startTime, this.#testTime, action.time);

      throw new JackrabbitError(`Test run cancelled`);
    }

    //  add to fails
    if (action.type === END_TEST && action.assertions.length) {
      this.#testTime += action.endTime - action.startTime;
      this.#failed = true;

      let assertions = this.#fails.get(action.collectionId);
      if (assertions) {
        assertions.add(action.testId);
      } else {
        this.#fails.set(action.collectionId, new Set([action.testId]));
      }
    }

    if (action.type === END_RUN) {
      logAssertions(collections, this.#fails);
      logResults(this.#failed, this.#startTime, this.#testTime, action.time);

      if (this.#failed) {
        throw new JackrabbitError(`Test run failed`);
      }
    }
  }
}

function logAssertions(
  collections: Collection[],
  fails: Map<number, Set<number>>,
) {
  for (let [index, collection] of collections.entries()) {
    let failedTests = fails.get(index);
    if (failedTests === undefined) continue;

    console.log(collection.title);

    for (let [index, test] of collection.tests.entries()) {
      if (!failedTests.has(index)) continue;

      console.log(`\u{2717} ${test.name}`);
    }
  }
}

function logCancelled(startTime: number, testTime: number, time: number) {
  const overhead = time - startTime;
  console.log(`
RESULTS:
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
  const status = failed ? "\u{2717} failed" : "\u{2714} passed";
  const overhead = time - startTime;
  console.log(`
RESULTS:
${status}
    duration: ${testTime.toFixed(4)} mS
    overhead: ${overhead.toFixed(4)} mS`);
}

export { JackrabbitError, Logger };
