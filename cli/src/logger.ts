import type { Collection, LoggerAction, LoggerInterface } from "./deps.ts";

import {
  CANCEL_RUN,
  END_RUN,
  END_TEST,
  START_RUN,
} from "./deps.js";

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
      throw new Error(`CANCELLED: test run cancelled`);
    }

    if (action.type === END_TEST) {
      this.testTime += action.endTime - action.startTime;

      if (action.assertions.length) {
        this.failed = true;
        console.log(`
FAILED:
Collection ID: ${action.collectionId}
Collection Title: ${collections[action.collectionId].title}
Test ID: ${action.testId}
Test Title: ${collections[action.collectionId].tests[action.testId].name}`);
        console.log(action.assertions);
      }
    }

    if (action.type === END_RUN) {
      const status = this.failed ? "FAILED" : "PASSED";

      console.log(`
start time: ${this.startTime}
end time: ${action.time}
overhead: ${action.time - this.startTime}
duration: ${this.testTime}

status: ${status}
      `);

      if (this.failed) {
        process.exit();
        // throw new Error(`FAILED: test run failed`);
      }
    }
  }
}

export { Logger };
