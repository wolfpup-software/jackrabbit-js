// brian taylor vann
// jackrabbit types

type Assertions = string[];
type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type Test = SyncTest | AsyncTest;

interface Collection {
  tests: Test[];
  title: string;
  runTestsAsynchronously: boolean;
  timeoutInterval: number;
}

type TestStatus =
  | "unsubmitted"
  | "submitted"
  | "passed"
  | "failed";

type Status =
  | TestStatus
  | "cancelled";

interface StartRun {
  type: "start_run";
  time: number;
}

interface EndRun {
  type: "end_run";
  time: number;
}

interface CancelRun {
  type: "cancel_run";
  time: number;
}

interface StartCollection {
  type: "start_collection";
  collectionId: number;
  time: number;
}

interface EndCollection {
  type: "end_collection";
  collectionId: number;
  time: number;
}

interface StartTest {
  type: "start_test";
  testId: number;
  collectionId: number;
  time: number;
}

interface EndTest {
  type: "end_test";
  testId: number;
  collectionId: number;
  startTime: number;
  endTime: number;
  assertions: string[];
}

type LoggerAction =
  | StartRun
  | EndRun
  | CancelRun
  | StartCollection
  | EndCollection
  | StartTest
  | EndTest;

interface LoggerInterface {
  cancelled: boolean;
  log(collection: Collection[], action: LoggerAction): void;
}

export type {
  Assertions,
  Collection,
  LoggerAction,
  LoggerInterface,
  Status,
  Test,
  TestStatus,
};
