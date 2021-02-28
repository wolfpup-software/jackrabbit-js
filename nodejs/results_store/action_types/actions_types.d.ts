import { TestCollection } from "../test_types/test_types";
declare type StartTestRunActionParams = {
    testCollection: TestCollection;
    startTime: number;
    stub: number;
};
declare type StartTestRunAction = {
    action: "START_TEST_RUN";
    params: StartTestRunActionParams;
};
declare type StartTestCollectionActionParams = {
    collectionID: number;
    startTime: number;
};
declare type StartTestCollectionAction = {
    action: "START_TEST_COLLECTION";
    params: StartTestCollectionActionParams;
};
declare type StartTestActionParams = {
    collectionID: number;
    testID: number;
    startTime: number;
};
declare type StartTestAction = {
    action: "START_TEST";
    params: StartTestActionParams;
};
declare type EndTestActionParams = {
    assertions?: string[];
    collectionID: number;
    testID: number;
    endTime: number;
};
declare type EndTestAction = {
    action: "END_TEST";
    params: EndTestActionParams;
};
declare type EndTestCollectionActionParams = {
    collectionID: number;
    endTime: number;
};
declare type EndTestCollectionAction = {
    action: "END_TEST_COLLECTION";
    params: EndTestCollectionActionParams;
};
declare type EndTestRunActionParams = {
    endTime: number;
};
declare type CancelTestsAction = {
    action: "CANCEL_RUN";
    params: EndTestRunActionParams;
};
declare type EndTestRunAction = {
    action: "END_TEST_RUN";
    params: EndTestRunActionParams;
};
declare type ResultsStoreAction = StartTestRunAction | StartTestCollectionAction | StartTestAction | CancelTestsAction | EndTestAction | EndTestCollectionAction | EndTestRunAction;
export { StartTestRunActionParams, StartTestCollectionActionParams, StartTestActionParams, EndTestActionParams, EndTestCollectionActionParams, EndTestRunActionParams, ResultsStoreAction, };
