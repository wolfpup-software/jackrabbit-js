import type { StoreAction, StoreData } from "./deps.ts";

class Logs {
  log(data: StoreData, action: StoreAction) {
    if (action.type === "end_test") {
      const r = data.testResults[action.testResultID];
      console.log(r.name, r.status);
    }
    if (action.type === "end_collection") {
      const r = data.collectionResults[action.collectionResultID];
      console.log(r.title, r.status);
    }
    if (action.type === "end_run") {
      const r = data.result;
      console.log("run:", r);
    }
  }
}

export { Logs };
