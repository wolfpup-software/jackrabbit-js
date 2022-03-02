// brian taylor vann
// jackrabbit types

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

type UnitTestStatus =
  | "pending"
  | "submitted"
  | "passed"
  | "failed";

type Status =
  | UnitTestStatus
  | "index_error"
  | "cancelled";

interface UnitTestResult {
  unitTestResultID: number;
  unitTestID: number;
  assertions: Assertions;
  endTime: number;
  name: string;
  startTime: number;
  status: UnitTestStatus;
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

interface RunResult {
  endTime: number;
  runResultID: number;
  indices: number[];
  startTime: number;
  status: Status;
  testTime: number;
}

type ActionKind =
  | "build_run"
  | "start_run"
  | "end_run"
  | "cancel_run"
  | "start_collection"
  | "end_collection"
  | "start_unit_test"
  | "end_unit_test";

interface BuildRunAction {
  kind: "build_run";
  runResultID: number;
  run: Collection[];
}

interface BuildRunBroadcastAction {
  kind: "build_run";
  runResultID: number;
}

interface StartRunAction {
  kind: "start_run";
  runResultID: number;
  startTime: number;
}

interface EndRunAction {
  kind: "end_run";
  runResultID: number;
  endTime: number;
}

interface CancelRunAction {
  kind: "cancel_run";
  runResultID: number;
  endTime: number;
}

interface StartCollectionAction {
  kind: "start_collection";
  collectionResultID: number;
  startTime: number;
}

interface EndCollectionAction {
  kind: "end_collection";
  collectionResultID: number;
  endTime: number;
}

interface StartUnitTestAction {
  kind: "start_unit_test";
  unitTestResultID: number;
  startTime: number;
}

interface EndUnitTestAction {
  kind: "end_unit_test";
  unitTestResultID: number;
  endTime: number;
  assertions: string[];
}

type SharedAction =
  | StartRunAction
  | EndRunAction
  | CancelRunAction
  | StartCollectionAction
  | EndCollectionAction
  | StartUnitTestAction
  | EndUnitTestAction;

type StoreAction =
  | SharedAction
  | BuildRunAction;

type BroadcastAction =
  | SharedAction
  | BuildRunBroadcastAction;

interface BroadcastData {
  readonly testResults: UnitTestResult[];
  readonly collectionResults: CollectionResult[];
  readonly runResults: RunResult[];
}

interface ResultsBroadcast {
  action: BroadcastAction;
  data: BroadcastData;
}

type Subscription<T = ResultsBroadcast> = (params: T) => void;

interface Broadcaster<M = ResultsBroadcast> {
  subscribe(subscription: Subscription<M>): number;
  unsubscribe(receipt: number): void;
  broadcast(message: M): void;
}

type StoreData = BroadcastData & {
  readonly unitTests: UnitTest[];
};

interface Store<S = StoreData, A = StoreAction, R = ResultsBroadcast> {
  readonly broadcaster: Broadcaster<R>;
  readonly data: S;
  dispatch(action: A): void;
}

type Response = (store: StoreData, action: StoreAction) => void;

type ResponseRecord = Record<ActionKind, Response>;

export type {
  ActionKind,
  Assertions,
  AsyncTest,
  BroadcastAction,
  BroadcastData,
  Broadcaster,
  Collection,
  CollectionResult,
  Response,
  ResponseRecord,
  ResultsBroadcast,
  RunResult,
  Status,
  Store,
  StoreAction,
  StoreData,
  Subscription,
  UnitTest,
  UnitTestResult,
};
