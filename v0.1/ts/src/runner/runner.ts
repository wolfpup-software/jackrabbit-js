// brian taylor vann
// runner

import type {
  Collection,
  ResultsBroadcast,
  Subscription,
} from "../jackrabbit_types.ts";

import { Store } from "../store/store.ts";
import { cancelRun, execRun } from "./actions.ts";

class Runner {
  private store = new Store();

  buildRun(run: Collection[]): number {
    return this.store.buildRun(run);
  }

  startRun(receipt: number) {
    execRun(this.store, receipt);
  }

  cancelRun(receipt: number) {
    cancelRun(this.store, receipt);
  }

  subscribe(subscription: Subscription<ResultsBroadcast>): number {
    return this.store.broadcaster.subscribe(subscription);
  }

  unsubscribe(receipt: number) {
    return this.store.broadcaster.unsubscribe(receipt);
  }
}

export { Runner };
