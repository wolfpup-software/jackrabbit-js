// brian taylor vann
// jackrabbit types

type Assertions = string[];
type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type Test = SyncTest | AsyncTest;
type Collection = {
  title: string;
  tests: Test[];
  runTestsAsynchronously: boolean;
  timeoutInterval: number;
};

type TestStatus =
  | "unsubmitted"
  | "pending"
  | "passed"
  | "failed";

type Status =
  | TestStatus
  | "cancelled";

interface TestResult {
  testResultID: number;
  testID: number;
  assertions: Assertions;
  endTime: number;
  name: string;
  startTime: number;
  status: TestStatus;
}

interface CollectionResult {
  collectionResultID: number;
  endTime: number;
  title: string;
  indices: number[];
  startTime: number;
  status: Status;
  runTestsAsynchronously: boolean;
  timeoutInterval: number;
  testTime: number;
}

interface Result {
  endTime: number;
  startTime: number;
  status: Status;
  testTime: number;
}

interface StartRun {
  type: "start_run";
  startTime: number;
}

interface EndRun {
  type: "end_run";
  endTime: number;
}

interface CancelRun {
  type: "cancel_run";
  endTime: number;
}

interface StartCollection {
  type: "start_collection";
  collectionResultID: number;
  startTime: number;
}

interface EndCollection {
  type: "end_collection";
  collectionResultID: number;
  endTime: number;
}

interface StartTest {
  type: "start_test";
  testResultID: number;
  startTime: number;
}

interface EndTest {
  type: "end_test";
  testResultID: number;
  endTime: number;
  assertions: string[];
}

type StoreAction =
  | StartRun
  | EndRun
  | CancelRun
  | StartCollection
  | EndCollection
  | StartTest
  | EndTest;

type Callback = (
  data: StoreData,
  action: StoreAction,
) => void;

type StoreData = {
  testResults: TestResult[];
  collectionResults: CollectionResult[];
  result: Result;
  tests: Test[];
};

type Reaction = (storeData: StoreData, action: StoreAction) => void;
type Reactions = Record<StoreAction["type"], Reaction>;

type AsyncReaction = (
  storeData: StoreData,
  action: StoreAction,
) => Promise<void>;
type AsyncReactions = Record<StoreAction["type"], AsyncReaction>;

interface StoreInterface {
  data: StoreData;
  dispatch(action: StoreAction): void;
}

interface RunnerInterface {
  start(store: StoreInterface): void;
  cancel(store: StoreInterface): void;
}

export type {
  Assertions,
  AsyncReaction,
  AsyncReactions,
  AsyncTest,
  Callback,
  Collection,
  CollectionResult,
  Reaction,
  Reactions,
  Result,
  RunnerInterface,
  StoreAction,
  StoreData,
  StoreInterface,
  Test,
  TestResult,
};
