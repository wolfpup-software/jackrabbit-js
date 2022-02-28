import type {
  Collection,
  Results,
  Run,
  TestBroadcaster,
  TestStore,
  TestStoreActions,
  UnitTest,
} from "../jackrabbit_types.ts";

import {
  PENDING,
  SUBMITTED,
  CANCELLED,
} from "../jackrabbit_types.ts";

type ActionKeys = 'startRun';

interface StartRunAction {
  kind: 'start_run';
  runID: number;
  startTime: number;
}

interface EndRunAction {
  kind: 'end_run';
  runID: number;
  endTime: number;
}

type ActionStuff = StartRunAction | EndRunAction;

type Response = (store: TestStore, params: ActionStuff) => void;

type ActionMap = Record<string, Response>


const start_run: Response = (store, action) => {
  if (action.kind !== 'start_run') return;

  const {runID, startTime} = action;
  const run = store.runResults[runID];
  if (run === undefined) {
    return;
  }
  run.status = SUBMITTED;
  run.startTime = startTime;
}

const actionMap: ActionMap = {
  start_run
}

class Actions<R = Results> implements TestStoreActions {
  broadcaster: TestBroadcaster<R>;
  store: TestStore;
  actionMap: ActionMap = actionMap;

  constructor(store: TestStore, broadcaster: TestBroadcaster<R>) {
    this.broadcaster = broadcaster;
    this.store = store;
  }

  dispatch(action: ActionStuff) {
    const response = actionMap[action.kind];
    if (response === undefined) {
      return;
    }

    response(this.store, action);

    // broadcast
    // (action, state) => {}
  }

  // below will be replaced by ActionMap
  cancelRun(runID: number, endTime: number) {
    const run = this.store.runResults[runID];
    if (run === undefined) {
      return;
    }

    // iterate through collecitons and add time
    run.endTime = endTime;
    run.status = CANCELLED;

        // broadcast action, result
  }

  startCollection(collectionID: number, startTime: number) {
    const collection = this.store.collectionResults[collectionID];
    if (collection === undefined) {
      return;
    }
    collection.status = SUBMITTED;
    collection.startTime = startTime;

        // broadcast action, result

  }

  endCollection(collectionID: number, endTime: number) {
    const collection = this.store.collectionResults[collectionID];
    if (collection === undefined) {
      return;
    }
    // iterate through collection
    // add all times
    collection.endTime = endTime;

        // broadcast action, result
  }

  startUnitTest(unitTestID: number, startTime: number) {
    const collection = this.store.testResults[unitTestID];
    if (collection === undefined) {
      return;
    }
    collection.status = SUBMITTED;
    collection.startTime = startTime;

        // broadcast action, result
  }

  endUnitTest(assertions: string[], unitTestID: number, endTime: number) {
    const unitTest = this.store.testResults[unitTestID];
    if (unitTest === undefined) {
      return;
    }
    unitTest.assertions = assertions;
    unitTest.endTime = endTime;

        // broadcast action, result
  }

  buildRun(run: Run) {
    const id = this.store.runResults.length;
    const indices = this.createCollectionResults(run);

    this.store.runResults.push({
      status: SUBMITTED,
      endTime: -1,
      startTime: -1,
      id,
      indices,
    });

        // broadcast action, result

    return id;
  }

  private createUnitTestResults(tests: UnitTest[]) {
    const startIndex = this.store.testResults.length;
    for (const test of tests) {
      const testID = this.store.unitTests.length;
      this.store.unitTests.push(test);

      const id = this.store.testResults.length;
      this.store.testResults.push({
        assertions: [],
        endTime: -1,
        name: test.name,
        startTime: -1,
        status: PENDING,
        id,
        testID,
      });
    }

    const endIndex = this.store.testResults.length;

    return [startIndex, endIndex];
  }

  private createCollectionResults(collections: Collection[]) {
    const startIndex = this.store.collectionResults.length;

    for (const collection of collections) {
      const id = this.store.collectionResults.length;
      const { tests, title, runTestsAsynchronously, timeoutInterval } =
        collection;
      const indices = this.createUnitTestResults(tests);

      this.store.collectionResults.push({
        endTime: -1,
        testTime: -1,
        startTime: -1,
        status: PENDING,
        id,
        indices,
        timeoutInterval,
        runTestsAsynchronously,
        title,
      });
    }

    const endIndex = this.store.testResults.length - 1;

    return [startIndex, endIndex];
  }
}

export { Actions };
