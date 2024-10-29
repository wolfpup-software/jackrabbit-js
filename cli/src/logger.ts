import type { Collection, LoggerAction, LoggerInterface } from "./deps.ts";

import { CANCEL_RUN, END_RUN, END_TEST, START_RUN } from "./deps.js";

import { JackrabbitError } from "./cli_types.js";

class Logger implements LoggerInterface {
  failed: boolean = false;
  cancelled: boolean = false;

  startTime: number = -1;
  testTime: number = 0;

  log(collections: Collection[], action: LoggerAction) {
    if (action.type === START_RUN) {
      this.startTime = action.time;
    }

    if (action.type === CANCEL_RUN) {
      throw new Error(`Test run cancelled`);
    }

    if (action.type === END_TEST) {
      this.testTime += action.endTime - action.startTime;

      if (action.assertions.length) {
        this.failed = true;
        console.log(`
FAILED:
${collections[action.collectionId].title}
  \u{2717} ${collections?.[action.collectionId].tests?.[action.testId].name}
    ${action.assertions}`);
      }
    }

    if (action.type === END_RUN) {
      const status = this.failed ? "\u{2717} failed" : "\u{2714} passed";
      const overhead = action.time - this.startTime;
      console.log(`
RESULTS:
  ${status}
    duration: ${this.testTime.toFixed(4)} mS
    overhead: ${overhead.toFixed(4)} mS`);

      if (this.failed) {
        throw new JackrabbitError(`Test run failed`);
      }
    }
  }
}

export { JackrabbitError, Logger };
