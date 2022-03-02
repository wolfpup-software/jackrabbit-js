// brian taylor vann
// store

import type {
  BroadcastData,
  Collection,
  ResultsBroadcast,
  Store as XStore,
  StoreAction,
  StoreData,
} from "../jackrabbit_types.ts";

import { BUILD_RUN } from "../utils/constants.ts";

import { actions } from "./actions.ts";
import { Broadcaster } from "./broadcaster.ts";

/*
  All store actions and ancillary functions must be syncronous
*/

class Store implements XStore {
  readonly broadcaster = new Broadcaster<ResultsBroadcast>();
  readonly data: StoreData = {
    unitTests: [],
    testResults: [],
    collectionResults: [],
    runResults: [],
  };

  private actions = actions;

  buildRun(run: Collection[]): number {
    const runResultID = this.data.runResults.length;

    this.dispatch({
      kind: BUILD_RUN,
      runResultID,
      run,
    });

    return runResultID;
  }

  dispatch(action: StoreAction) {
    const response = this.actions[action.kind];
    if (response === undefined) return;

    response(this.data, action);

    const data: BroadcastData = {
      testResults: this.data.testResults,
      collectionResults: this.data.collectionResults,
      runResults: this.data.runResults,
    };

    // do not broadcast tests, only serializable results
    if (action.kind === BUILD_RUN) {
      const { runResultID } = action;
      this.broadcaster.broadcast({
        data,
        action: { kind: BUILD_RUN, runResultID },
      });
    }

    this.broadcaster.broadcast({ data, action });
  }
}

export { Store };
