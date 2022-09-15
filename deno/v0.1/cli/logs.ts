import type { StoreAction, StoreData } from "./deps.ts";

class Logs {
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
      const r = data.result;
      console.log(`
status: ${r.status}
duration: ${r.testTime}
      `);
    }
  }
}

export { Logs };
