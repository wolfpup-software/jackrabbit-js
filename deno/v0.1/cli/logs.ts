import type { Config, LogInterface } from "./cli_types.ts";
import type { StoreAction, StoreData } from "./deps.ts";

class Logs implements LogInterface {
  logStyle: string;

  constructor(config: Config) {
    this.logStyle = config.log_style;
  }

  log(data: StoreData, action: StoreAction) {
    if (action.type === "end_test") {
      const r = data.testResults[action.testResultID];
      if (r.status === "FAILED") {
        console.log(r.status, r.name);
      }
    }
    if (action.type === "end_collection") {
      const r = data.collectionResults[action.collectionResultID];
      if (r.status === "FAILED") {
        console.log(r.status, r.title);
      }
    }
    if (action.type === "end_run") {
      console.log(`
start time: ${data.startTime}
end time: ${data.endTime}
duration: ${data.testTime}

status: ${data.status}
      `);
    }
  }
}

export { Logs };
