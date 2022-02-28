// brian taylor vann
// state store

import type {
  CollectionResult,
  RunResult,
  TestStore,
  UnitTest,
  UnitTestResult,
} from "../jackrabbit_types.ts";

import { CANCELLED } from "../jackrabbit_types.ts";

class Store implements TestStore {
  readonly unitTests: UnitTest[] = [];
  readonly testResults: UnitTestResult[] = [];
  readonly collectionResults: CollectionResult[] = [];
  readonly runResults: RunResult[] = [];

  // the store has an action map
  // the store has a dispatch available
  // the store has a broadcast available

  // 

  // dispatch(action: ActionStuff) {}

  runIsCancelled(receipt: number): boolean | undefined {
    const run = this.runResults[receipt];
    if (run === undefined) {
      return true;
    }

    return run.status === CANCELLED;
  }
}

export { Store };
