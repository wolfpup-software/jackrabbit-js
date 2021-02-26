declare type Assertions = string[] | undefined;
declare type TestStatus = "unsubmitted" | "submitted" | "passed" | "cancelled" | "failed";
declare type Result = {
    status: TestStatus;
    assertions?: Assertions;
    startTime?: number;
    endTime?: number;
    name: string;
};
declare type Results = Result[];
declare type TestResults = {
    title: string;
    status: TestStatus;
    startTime?: number;
    endTime?: number;
    results?: Results;
};
declare type CollectionResults = TestResults[];
declare type TestRunResults = {
    status: TestStatus;
    startTime?: number;
    endTime?: number;
    results?: CollectionResults;
};
export { Assertions, TestStatus, Result, Results, TestResults, CollectionResults, TestRunResults, };
