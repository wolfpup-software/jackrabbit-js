import type { Collection, LoggerAction, LoggerInterface } from "./deps.ts";
import type { ConfigInterface } from "./cli_types.ts";

import {
  CANCEL_RUN,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  START_RUN,
} from "./deps.ts";

function getStatus(cancelled: boolean, failed: boolean) {
  if (cancelled) return "CANCELLED";
  if (failed) return "FAILED";
  return "SUCCESS";
}

class Logger implements LoggerInterface {
  config: ConfigInterface;

  cancelled: boolean = false;
  failed: boolean = false;

  startTime: number = -1;
  testTime: number = 0;

  constructor(config: ConfigInterface) {
    this.config = config;
  }

  log(collections: Collection[], action: LoggerAction) {
    if (action.type === CANCEL_RUN) {
      this.cancelled = true;
      console.log("CANCELLED: test run cancelled");
    }

    if (action.type === START_RUN) {
      this.startTime = action.time;
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
      console.log(`
start time: ${this.startTime}
end time: ${action.time}
overhead: ${action.time - this.startTime}
duration: ${this.testTime}

status: ${getStatus(this.cancelled, this.failed)}
      `);
    }
  }
}

export { Logger };
