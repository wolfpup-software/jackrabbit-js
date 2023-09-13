import type { Collection, LoggerAction, LoggerInterface } from "./deps.ts";

import {
  CANCEL_RUN,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  START_RUN,
} from "./deps.ts";

class Logger implements LoggerInterface {
  failed: boolean = false;

  startTime: number = -1;
  testTime: number = 0;

  log(collections: Collection[], action: LoggerAction) {
    if (action.type === START_RUN) {
      this.startTime = action.time;
    }

    if (action.type === CANCEL_RUN) {
      console.log("CANCELLED: test run cancelled");
      Deno.exit(3);
    }

    if (action.type === END_TEST) {
      this.testTime += action.endTime - action.startTime;

      if (action.assertions.length) {
        this.failed = true;
        console.log(
          "FAILED:",
          action.collectionId,
          collections[action.collectionId].title,
          action.testId,
          collections[action.collectionId].tests[action.testId].name,
        );
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
      
      // send results
      
      // send end server
    }
  }
}

export { Logger };
