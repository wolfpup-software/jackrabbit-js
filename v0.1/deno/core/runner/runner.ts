// brian taylor vann
// runner

import type { Collection } from "../utils/jackrabbit_types.ts";

import type { Store } from "../store/store.ts";
import { cancelRun, execRun } from "./async_reactions.ts";

class Runner {
  buildRun(store: Store, run: Collection[]) {
    store.dispatch({ type: "build_run", run });
  }

  startRun(store: Store) {
    execRun(store);
  }

  cancelRun(store: Store) {
    cancelRun(store);
  }
}

export { Runner };
