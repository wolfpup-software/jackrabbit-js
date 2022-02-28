// brian taylor vann
// run tests

// TODO:
// use performance.now() when nodejs is dead

// Results and tests are stored in arrays in the `../store/store.ts` module.
// Results are retrieved and mutated. They are not pure or functional.
// Mutations occur hereS

import type {
  Assertions,
  CollectionResult,
  TestStore,
  TestStoreActions,
  UnitTestResult,
} from "../jackrabbit_types.ts";

type CreateTimeout = (requestedInterval: number) => Promise<Assertions>;
type Sleep = (time: number) => Promise<void>;

const TIMOUT_INTERVAL = 10000;

const sleep: Sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const createTimeout: CreateTimeout = async (timeoutInterval: number) => {
  const interval = timeoutInterval === -1 ? TIMOUT_INTERVAL : timeoutInterval;
  await sleep(interval);

  return [`timed out at: ${timeoutInterval}`];
};

class Actions {
  private store: TestStore;
  private storeActions: TestStoreActions;

  constructor(store: TestStore, storeActions: TestStoreActions) {
    this.store = store;
    this.storeActions = storeActions;
  }

  async execResult(receipt: number) {
    const runResult = this.store.runResults[receipt];
    if (runResult === undefined) {
      // do nothing?
      return;
    }

    const { indices, id } = runResult;
    this.storeActions.startRun(id, performance.now());

    const dest = indices[1];

    let target = indices[0];
    while (target < dest) {
      if (this.store.runIsCancelled(receipt)) {
        return;
      }

      const collection = this.store.collectionResults[target];
      if (collection !== undefined) {
        collection.runTestsAsynchronously
          ? await this.execCollection(receipt, collection)
          : await this.execCollectionOrdered(receipt, collection);
      }

      target += 1;
    }

    if (this.store.runIsCancelled(receipt)) {
      return;
    }

    this.storeActions.endRun(id, performance.now());
  }

  private async execUnitTest(
    runreceipt: number,
    testResult: UnitTestResult,
    timeoutInterval: number,
  ) {
    const { testID } = testResult;

    this.storeActions.startUnitTest(testID, performance.now());

    const testFunc = this.store.unitTests[testID];
    const assertions = (testFunc !== undefined)
      ? await Promise.race([
        createTimeout(timeoutInterval),
        testFunc(),
      ])
      : [];

    if (this.store.runIsCancelled(runreceipt)) return;

    this.storeActions.endUnitTest(assertions, testID, performance.now());
  }

  private async execCollection(
    runreceipt: number,
    collectionResuilt: CollectionResult,
  ) {
    const { indices, id, timeoutInterval } = collectionResuilt;
    const tests = [];

    let target = indices[0];
    const dest = indices[1];
    while (target <= dest) {
      const testResult = this.store.testResults[target];
      if (testResult !== undefined) {
        tests.push(
          this.execUnitTest(runreceipt, testResult, timeoutInterval),
        );
      }

      target += 1;
    }

    this.storeActions.startCollection(id, performance.now());

    await Promise.all(tests);
    if (this.store.runIsCancelled(runreceipt)) return;

    this.storeActions.endCollection(id, performance.now());
  }

  private async execCollectionOrdered(
    runreceipt: number,
    collectionResuilt: CollectionResult,
  ) {
    const { indices, id, timeoutInterval } = collectionResuilt;
    let target = indices[0];
    const dest = indices[1];

    this.storeActions.startCollection(id, performance.now());

    while (target < dest) {
      if (this.store.runIsCancelled(runreceipt)) return;

      const testResult = this.store.testResults[target];
      if (testResult !== undefined) {
        await this.execUnitTest(runreceipt, testResult, timeoutInterval);
      }

      target += 1;
    }

    if (this.store.runIsCancelled(runreceipt)) return;

    this.storeActions.endCollection(id, performance.now());
  }
}

export { Actions };
