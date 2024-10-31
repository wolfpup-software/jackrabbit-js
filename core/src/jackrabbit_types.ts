type Assertions = undefined | string | string[];
type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type Test = SyncTest | AsyncTest;

interface Options {
  title: string;
  runAsynchronously: boolean;
  timeoutInterval: number;
}

interface TestModule {
  testCollection: Test[];
  options: Options;
}

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
  assertions: Assertions;
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
  log(testModules: TestModule[], action: LoggerAction): void;
}

export type {
  Assertions,
  LoggerAction,
  LoggerInterface,
  Test,
  Options,
  TestModule,
};
