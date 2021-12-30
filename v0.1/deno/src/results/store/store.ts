// brian taylor vann
// state store

import type {
  CollectionResults,
  EndTestCollectionParams,
  EndTestParams,
  EndTestRunParams,
  Results,
  StartTestCollectionParams,
  StartTestParams,
  StartTestRunParams,
  TestResults,
  TestRunResults,
} from "../../jackrabbit_types.ts";

import { copycopy } from "../../copycopy/copycopy.ts";

type BuildResults = (params: StartTestRunParams) => void;
type StartTestCollection = (params: StartTestCollectionParams) => void;
type StartTest = (params: StartTestParams) => void;
type CancelRun = (params: EndTestRunParams) => void;
type EndTest = (params: EndTestParams) => void;
type EndTestCollection = (params: EndTestCollectionParams) => void;
type EndTestRun = (params: EndTestRunParams) => void;

type GetResults = () => TestRunResults;

const defaultResultsState: TestRunResults = {
  status: "unsubmitted",
};

let resultsState: TestRunResults = { ...defaultResultsState };

type AllTestCollectionsHavePassed = (
  collectionResults: CollectionResults,
) => boolean;

// for test collection
const allTestCollectionsHavePassed: AllTestCollectionsHavePassed = (
  collectionResults,
) => {
  for (const collection of collectionResults) {
    if (collection.status === "failed") {
      return false;
    }
  }
  return true;
};

type AllTestsHavePassed = (testResults: Results) => boolean;

const allTestsHavePassed: AllTestsHavePassed = (testResults: Results) => {
  for (const result of testResults) {
    if (result.status !== "passed") {
      return false;
    }
  }
  return true;
};

const buildResults: BuildResults = ({
  testCollection,
  startTime,
}) => {
  const nextState: TestRunResults = {
    status: "submitted",
    results: [],
    startTime,
  };

  for (const collection of testCollection) {
    const { tests, title } = collection;
    const collectionResults: TestResults = {
      title,
      status: "unsubmitted",
    };

    const results: Results = [];
    for (const test of tests) {
      const { name } = test;
      results.push({
        status: "unsubmitted",
        name,
      });
    }

    if (nextState.results) {
      nextState.results.push({ ...collectionResults, ...{ results } });
    }
  }

  resultsState = nextState;
};

const startTestCollection: StartTestCollection = (params) => {
  if (resultsState.results === undefined) {
    return;
  }

  const { startTime, collectionID } = params;

  const collectionResult = resultsState?.results?.[collectionID];
  if (collectionResult) {
    collectionResult.status = "submitted";
    collectionResult.startTime = startTime;
  }
};

const startTest: StartTest = (params) => {
  if (resultsState.results === undefined) {
    return;
  }

  const { startTime, collectionID, testID } = params;

  const testResult = resultsState?.results?.[collectionID]?.results?.[testID];
  if (testResult) {
    testResult.status = "submitted";
    testResult.startTime = startTime;
  }
};

const cancelRun: CancelRun = (params) => {
  const { endTime } = params;
  resultsState.endTime = endTime;
  resultsState.status = "cancelled";

  const collectionResults = resultsState.results;
  if (collectionResults) {
    for (const collection of collectionResults) {
      if (collection.status === "submitted") {
        collection.status = "cancelled";
      }

      const testResults = collection.results;
      if (testResults) {
        for (const result of testResults) {
          if (result.status === "submitted") {
            result.status = "cancelled";
          }
        }
      }
    }
  }
};

const endTest: EndTest = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { assertions, endTime, collectionID, testID } = params;

  const testResult = resultsState?.results?.[collectionID]?.results?.[testID];
  if (testResult === undefined) {
    return;
  }

  testResult.status = "failed";
  if (assertions === undefined) {
    testResult.status = "passed";
  }
  if (assertions && assertions.length === 0) {
    testResult.status = "passed";
  }

  testResult.assertions = assertions;
  testResult.endTime = endTime;
};

const endTestCollection: EndTestCollection = (params) => {
  if (resultsState.results === undefined) {
    return;
  }
  const { endTime, collectionID } = params;

  const collection = resultsState.results[collectionID];
  if (collection === undefined) {
    return;
  }

  collection.endTime = endTime;
  collection.status = "failed";

  const collectionResults = collection.results;
  if (collectionResults && allTestsHavePassed(collectionResults)) {
    collection.status = "passed";
  }
};

const endTestRun: EndTestRun = (params) => {
  const { endTime } = params;
  resultsState.endTime = endTime;
  resultsState.status = "failed";

  const results = resultsState.results;
  if (results && allTestCollectionsHavePassed(results)) {
    resultsState.status = "passed";
  }
};

const getResults: GetResults = () => {
  return copycopy<TestRunResults>(resultsState);
};

export {
  buildResults,
  cancelRun,
  endTest,
  endTestCollection,
  endTestRun,
  getResults,
  startTest,
  startTestCollection,
};
