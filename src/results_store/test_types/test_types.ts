// brian taylor vann
// jackrabbit

import type { Assertions } from "../results_store";

type SyncTest = () => Assertions;
type AsyncTest = () => Promise<Assertions>;
type Test = SyncTest | AsyncTest;
type TestParams = {
  title: string;
  tests: Test[];
  runTestsAsynchronously?: boolean;
  timeoutInterval?: number;
};
type TestCollection = TestParams[];

export type { Test, TestCollection, TestParams };
