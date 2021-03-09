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

export type {
  Assertions,
  CollectionResults,
  Result,
  Results,
  TestResults,
  TestRunResults,
  TestStatus,
};
