import type {
  Assertions,
  LoggerInterface,
  Options,
  TestModule,
} from "./jackrabbit_types.js";

const TIMEOUT_INTERVAL = 10000;

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function createTimeout(timeoutInterval: number): Promise<Assertions> {
  const interval = timeoutInterval === -1 ? TIMEOUT_INTERVAL : timeoutInterval;
  await sleep(interval);

  return [`timed out at: ${interval}`];
}

async function execTest(
  collections: TestModule,
  logger: LoggerInterface,
  collectionId: number,
  testId: number,
) {
  if (logger.cancelled) return;
  logger.log(collections, {
    type: "start_test",
    time: performance.now(),
    testId,
    collectionId,
  });

  const testFunc = collections[collectionId].tests[testId];
  const startTime = performance.now();
  const assertions = await Promise.race([
    createTimeout(collections[collectionId].timeoutInterval),
    testFunc(),
  ]);
  const endTime = performance.now();

  if (logger.cancelled) return;
  logger.log(collections, {
    type: "end_test",
    testId,
    collectionId,
    assertions,
    endTime,
    startTime,
  });
}

async function execCollection(
  collections: TestModule,
  logger: LoggerInterface,
  collectionId: number,
) {
  const wrappedTests = [];
  let testId = 0;
  const length = collections[collectionId].tests.length;
  while (testId < length) {
    wrappedTests.push(execTest(collections, logger, collectionId, testId));

    testId += 1;
  }

  await Promise.all(wrappedTests);
}

async function execCollectionOrdered(
  collections: TestModule,
  logger: LoggerInterface,
  collectionId: number,
) {
  const numTests = collections[collectionId].tests.length;
  let index = 0;
  while (index < numTests) {
    if (logger.cancelled) return;
    await execTest(collections, logger, collectionId, index);

    index += 1;
  }
}

async function startRun(logger: LoggerInterface, testModules: TestModule) {
  if (logger.cancelled) return;
  const { testCollection, options } = testModules;
  logger.log(testModules, {
    type: "start_run",
    time: performance.now(),
  });

  let collectionId = 0;
  const numCollections = testCollection.length;
  while (collectionId < numCollections) {
    if (logger.cancelled) return;
    logger.log(testModules, {
      type: "start_collection",
      time: performance.now(),
      collectionId,
    });

    details.runAsynchronously
      ? await execCollection(testModules, logger, collectionId)
      : await execCollectionOrdered(testModules, logger, collectionId);

    if (logger.cancelled) return;
    logger.log(testModules, {
      type: "end_collection",
      time: performance.now(),
      collectionId,
    });

    collectionId += 1;
  }

  if (logger.cancelled) return;
  logger.log(testModules, {
    type: "end_run",
    time: performance.now(),
  });
}

function cancelRun(logger: LoggerInterface, testModule: TestModule) {
  if (logger.cancelled) return;
  logger.log(testModule, {
    type: "cancel_run",
    time: performance.now(),
  });
}

export { startRun, cancelRun };
