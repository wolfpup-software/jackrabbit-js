// brian taylor vann
// test tuypes

import type { Assertions } from "../results_store.ts";

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

export type { TestUnit, TestCollection, TestParams };
