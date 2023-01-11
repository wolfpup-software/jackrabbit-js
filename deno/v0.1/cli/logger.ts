import type {
  LoggerInterface,
  StoreAction,
  StoreDataInterface,
} from "./deps.ts";
import type { ConfigInterface } from "./cli_types.ts";

import { END_COLLECTION, END_RUN, END_TEST, FAILED } from "./deps.ts";

class Logger implements LoggerInterface {
  config: ConfigInterface;

  constructor(config: ConfigInterface) {
    this.config = config;
  }

  log(data: StoreDataInterface, action: StoreAction) {
    if (action.type === END_TEST) {
      const r = data.testResults[action.testResultID];
      if (r.assertions?.length) {
        console.log("FAILED:", r.name);
        console.log(r.assertions);
      }
    }

    if (action.type === END_COLLECTION) {
      const r = data.collectionResults[action.collectionResultID];
      if (r.status === FAILED) {
        console.log(r.status, r.title);
      }
    }

    if (action.type === END_RUN) {
      console.log(`
start time: ${data.startTime}
end time: ${data.endTime}
overhead: ${data.endTime - data.startTime}
duration: ${data.testTime}

status: ${data.status}
      `);
    }
  }
}

export { Logger };
