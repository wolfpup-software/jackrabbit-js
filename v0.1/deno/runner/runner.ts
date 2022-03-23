// brian taylor vann
// runner

import type {
  Collection,
  ResultsBroadcast,
  Subscription,
} from "../utils/jackrabbit_types.ts";

import { Store, XStore } from "../store/store.ts";
import { cancelRun, execRun } from "./async_actions.ts";

//
// how do we interact with an async state pattern?
//
// store makes sync calls
// runner makes async calls to itself
//

class Runner {
  private store: XStore;

  constructor(store: XStore) {
    this.store = store;
  }

  buildRun(id: string, run: Collection[]) {
    this.store.dispatch({ type: "build_run", id, run });
  }

  startRun(id: string) {
    execRun(this.store, id);
  }

  cancelRun(id: string) {
    cancelRun(this.store, id);
  }
}

export { Runner };
