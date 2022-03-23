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

interface BuildRunAction {
  type: "build_run";
  runResultID: number;
  run: Collection[];
}

interface BuildRunBroadcastAction {
  type: "build_run";
  runResultID: number;
}

interface StartRunAction {
  type: "start_run";
  runResultID: number;
}

interface EndRunAction {
  type: "end_run";
  runResultID: number;
  startTime: number;
  endTime: number;
}

interface CancelRunAction {
  type: "cancel_run";
  runResultID: number;
  endTime: number;
}

interface StartCollectionAction {
  type: "start_collection";
  collectionResultID: number;
}

interface EndCollectionAction {
  type: "end_collection";
  collectionResultID: number;
  startTime: number;
  endTime: number;
}

interface StartUnitTestAction {
  type: "start_unit_test";
  unitTestResultID: number;
}

interface EndUnitTestAction {
  type: "end_unit_test";
  unitTestResultID: number;
  startTime: number;
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

type Subscription<T> = (params: T) => void;

type StoreData = BroadcastData & {
  readonly unitTests: UnitTest[];
};

interface Action {
  type: string;
}

type Reaction<S, A> = (storeData: S, action: A) => void;
type AsyncReaction<S, A> = (storeData: S, action: A) => Promise<void>;


interface Action {
  type: string;
}

type ReactionRecord<S, A extends Action> = Record<string, Reaction<S, A>>;
type AsyncReactionRecord<S, A extends Action> = Record<string, AsyncReaction<S, A>>;

interface Store {
  readonly data: StoreData;
  dispatch(action: StoreAction): void;
}

interface StoreContext<D, A> {
  data: D;
  reactions: ReactionRecord<D, A>;
}

interface StoreInterface<D, A> {
  dispatch(action: A): void;
  getState(): D;
}
type Translate<D, B> = (source: D, target?: B) => B;

export type {
  Action,
  Assertions,
  AsyncTest,
  AsyncReaction,
  AsyncReactionRecord,
  BroadcastAction,
  BroadcastData,
  Collection,
  CollectionResult,
  Reaction,
  ReactionRecord,
  ResultsBroadcast,
  RunResult,
  Status,
  Store,
  StoreAction,
  StoreContext,
  StoreData,
  StoreInterface,
  Subscription,
  Translate,
  UnitTest,
  UnitTestResult,
};
