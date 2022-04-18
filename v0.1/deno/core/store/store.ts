// brian taylor vann
// store

import type {
  BroadcastData,
  Callback,
  StoreAction,
  StoreData,
  StoreInterface,
  Test,
} from "../utils/jackrabbit_types.ts";

import { UNSUBMITTED } from "../utils/constants.ts";
import { reactions } from "./reactions.ts";

function createInitialData(): StoreData {
  return {
    testResults: [],
    collectionResults: [],
    result: {
      status: UNSUBMITTED,
      endTime: 0,
      startTime: 0,
      testTime: 0,
    },
    tests: [],
  };
}

function translate(source: StoreData): BroadcastData {
  const { testResults, collectionResults, result } = source;
  return {
    testResults,
    collectionResults,
    result,
  };
}

class Store implements StoreInterface {
  private data: StoreData;
  private broadcastData: BroadcastData;
  private callback: Callback = () => {};

  constructor(data: StoreData) {
    this.data = data;
    this.broadcastData = translate(this.data);
  }

  setCallback(callback: Callback) {
    this.callback = callback;
  }

  dispatch(action: StoreAction) {
    const reaction = reactions[action.type];
    if (reaction === undefined) return;

    reaction(this.data, action);
    this.broadcastData = translate(this.data);

    this.callback(this.broadcastData);
  }

  getState(): BroadcastData {
    return this.broadcastData;
  }

  getTest(id: number): Test {
    return this.data.tests[id];
  }
}

export { createInitialData, Store };
