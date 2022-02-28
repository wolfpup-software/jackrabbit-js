// brian taylor vann
// run tests

// TODO:
// use performance.now() when nodejs is dead

// Results and tests are stored in arrays in the `../store/store.ts` module.
// Results are retrieved and mutated. They are not pure or functional.
// Mutations occur hereS

import type { Results, Run } from "../jackrabbit_types.ts";
import type { Subscription } from "../jackrabbit_types.ts";

import { Broadcaster } from "../store/broadcaster.ts";
import { Store } from "../store/store.ts";
import { Actions as StoreActions } from "../store/actions.ts";
import { Actions as RunnerActions } from "./actions.ts";

const TIMOUT_INTERVAL = 10000;

class Runner<S = Results> {
  private broadcaster = new Broadcaster<S>();
  private store = new Store();
  private storeActions = new StoreActions(this.store, this.broadcaster);
  private runnerActions = new RunnerActions(
    this.store,
    this.storeActions,
  );

  startRun(run: Run) {
    const receipt = this.storeActions.buildRun(run);
    this.runnerActions.execResult(receipt);

    return receipt;
  }

  cancelRun(receipt: number) {
    this.storeActions.cancelRun(receipt, performance.now());
  }

  subscribe(subscription: Subscription<S>): number {
    return this.broadcaster.subscribe(subscription);
  }

  unsubscribe(receipt: number) {
    return this.broadcaster.unsubscribe(receipt);
  }
}

export { Runner };
