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

type StoreAction =
  | StartRun
  | EndRun
  | CancelRun
  | StartCollection
  | EndCollection
  | StartTest
  | EndTest;

interface StoreDataInterface {
  endTime: number;
  startTime: number;
  status: Status;
  testTime: number;
}

type Reaction = (
  collections: Collection[],
  storeData: StoreDataInterface,
  action: StoreAction,
) => void;
type Reactions = Record<StoreAction["type"], Reaction>;

type AsyncReaction = (
  storeData: StoreDataInterface,
  action: StoreAction,
) => Promise<void>;
type AsyncReactions = Record<StoreAction["type"], AsyncReaction>;

interface LoggerInterface {
  cancelled: boolean;
  log(collection: Collection[], action: StoreAction): void;
  // logAsync(data: StoreDataInterface, action: StoreAction): Promise<void>;
}

interface RunnerInterface {
  run(collections: Collection[], logger: LoggerInterface): Promise<void>;
  cancel(collections: Collection[], logger: LoggerInterface): void;
}

interface ImporterInterface {
  load(filename: string): Collection[];
  // loadAsync(filename: string): Promise<Collection[]>;
}

export type {
  Assertions,
  AsyncReactions,
  Collection,
  // CollectionResult,
  ImporterInterface,
  LoggerInterface,
  Reactions,
  RunnerInterface,
  Status,
  StoreAction,
  Test,
  // TestResult,
  TestStatus,
};
