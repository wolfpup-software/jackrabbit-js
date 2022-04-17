// brian taylor vann
// runner

import type { Callback, Collection } from "../utils/jackrabbit_types.ts";

import { Store } from "../store/store.ts";
import { cancelRun, execRun } from "./async_reactions.ts";

class Runner {
  private store: Store;

  constructor(callback: Callback) {
    this.store = new Store(callback);
  }

  buildRun(run: Collection[]) {
    this.store.dispatch({ type: "build_run", run });
  }

  startRun() {
    execRun(this.store);
  }

  cancelRun() {
    cancelRun(this.store);
  }
}

export { Runner };
