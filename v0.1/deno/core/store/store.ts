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

import { SUBMITTED } from "../utils/constants.ts";

import { reactions } from "./reactions.ts";

type Translate = (source: StoreData) => BroadcastData;

const convert: Translate = (source) => {
  const { testResults, collectionResults, result } = source;
  return {
    testResults,
    collectionResults,
    result,
  };
};

class Store implements StoreInterface {
  private data: StoreData;
  private broadcastData: BroadcastData;
  private callback: Callback;

  constructor(callback: Callback) {
    this.data = {
      testResults: [],
      collectionResults: [],
      result: {
        status: SUBMITTED,
        endTime: 0,
        startTime: 0,
        testTime: 0,
      },
      tests: [],
    };
    this.broadcastData = convert(this.data);
    this.callback = callback;
  }

  dispatch(action: StoreAction) {
    const reaction = reactions[action.type];
    if (reaction === undefined) return;

    reaction(this.data, action);

    this.broadcastData = convert(this.data);

    this.callback(this.broadcastData);
  }

  getState(): BroadcastData {
    return this.broadcastData;
  }
  getTest(id: number): Test {
    return this.data.tests[id];
  }
}

export { Store };
