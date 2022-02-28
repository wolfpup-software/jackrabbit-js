// brian taylor vann
// jackrabbit types

// tests

type Assertions = string[];
type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type UnitTest = SyncTest | AsyncTest;
type Collection = {
  title: string;
  tests: UnitTest[];
  runTestsAsynchronously: boolean;
  timeoutInterval: number;
};

type Run = Collection[];

type UnitTestStatus =
  | "pending"
  | "submitted"
  | "unresolved"
  | "passed"
  | "failed";

type Status =
  | UnitTestStatus
  | "index_error"
  | "cancelled";

type UnitTestResult = {
  id: number;
  testID: number;
  assertions: Assertions;
  endTime: number;
  name: string;
  startTime: number;
  status: UnitTestStatus;
};

type CollectionResult = {
  id: number;
  endTime: number;
  title: string;
  indices: number[];
  startTime: number;
  status: Status;
  runTestsAsynchronously: boolean;
  timeoutInterval: number;
  testTime: number;
};

type RunResult = {
  endTime: number;
  id: number;
  indices: number[];
  startTime: number;
  status: Status;
};

interface Results {
  readonly testResults: UnitTestResult[];
  readonly collectionResults: CollectionResult[];
  readonly runResults: RunResult[];
}

type TestStore = Results & {
  readonly unitTests: UnitTest[];

  runIsCancelled(receipt: number): boolean | undefined;
};

interface TestStoreActions {
  startRun(runID: number, startTime: number): void;
  endRun(runID: number, endTime: number): void;
  cancelRun(runID: number, endTime: number): void;
  startCollection(collectionID: number, startTime: number): void;
  endCollection(collectionID: number, endTime: number): void;
  startUnitTest(unitTestID: number, startTime: number): void;
  endUnitTest(assertions: string[], unitTestID: number, endTime: number): void;
  buildRun(run: Run): number;
}

type Subscription<T> = (params: T) => void;

interface TestBroadcaster<T> {
  subscribe(resultsCallback: Subscription<T>): number;
  unsubscribe(receipt: number): void;
  broadcast(message: T): void;
}

const PENDING = "pending";
const SUBMITTED = "submitted";
const CANCELLED = "cancelled";

interface StartRunAction {
  kind: 'start_run';
  runID: number;
  startTime: number;
}

type Actions = StartRunAction

type ActionMap = 
interface ActionMap {
  start_run(store: TestStore, params: StartRunAction): void
}

export type {
  Assertions,
  AsyncTest,
  Collection,
  CollectionResult,
  Results,
  Run,
  RunResult,
  Status,
  Subscription,
  TestBroadcaster,
  TestStore,
  TestStoreActions,
  UnitTest,
  UnitTestResult,
};

export {
  PENDING,
  SUBMITTED,
  CANCELLED,
};

