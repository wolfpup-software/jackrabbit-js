// brian taylor vann
// state types

type Assertions = string[] | undefined;
type TestStatus =
  | "unsubmitted"
  | "submitted"
  | "passed"
  | "cancelled"
  | "failed";
type Result = {
  status: TestStatus;
  assertions?: Assertions;
  startTime?: number;
  endTime?: number;
  name: string;
};
type Results = Result[];
type TestResults = {
  title: string;
  status: TestStatus;
  startTime?: number;
  endTime?: number;
  results?: Results;
};
type CollectionResults = TestResults[];
type TestRunResults = {
  status: TestStatus;
  startTime?: number;
  endTime?: number;
  results?: CollectionResults;
};

type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type TestUnit = SyncTest | AsyncTest;
type TestParams = {
  title: string;
  tests: TestUnit[];
  runTestsAsynchronously?: boolean;
  timeoutInterval?: number;
};
type TestCollection = TestParams[];

type StartTestRunParams = {
  testCollection: TestCollection;
  startTime: number;
  stub: number;
};

type StartTestCollectionParams = {
  collectionID: number;
  startTime: number;
};

type StartTestParams = {
  collectionID: number;
  testID: number;
  startTime: number;
};

type EndTestParams = {
  assertions?: string[];
  collectionID: number;
  testID: number;
  endTime: number;
};

type EndTestCollectionParams = {
  collectionID: number;
  endTime: number;
};

type EndTestRunParams = {
  endTime: number;
};

export type {
  Assertions,
  CollectionResults,
  EndTestCollectionParams,
  EndTestParams,
  EndTestRunParams,
  Result,
  Results,
  StartTestCollectionParams,
  StartTestParams,
  StartTestRunParams,
  TestCollection,
  TestParams,
  TestResults,
  TestRunResults,
  TestStatus,
  TestUnit,
};
