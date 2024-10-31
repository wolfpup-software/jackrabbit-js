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
  testModules: TestModule[],
  logger: LoggerInterface,
  collectionId: number,
  testId: number,
) {
  if (logger.cancelled) return;
  logger.log(testModules, {
    type: "start_test",
    time: performance.now(),
    testId,
    collectionId,
  });

  const { testCollection, options } = testModules[collectionId];
  const testFunc = testCollection[testId];
  const startTime = performance.now();
  const assertions = await Promise.race([
    createTimeout(options.timeoutInterval),
    testFunc(),
  ]);
  const endTime = performance.now();

  if (logger.cancelled) return;
  logger.log(testModules, {
    type: "end_test",
    testId,
    collectionId,
    assertions,
    endTime,
    startTime,
  });
}

async function execCollection(
  testModules: TestModule[],
  logger: LoggerInterface,
  collectionId: number,
) {
  const { testCollection } = testModules[collectionId];

  const wrappedTests = [];
  let testId = 0;
  const length = testCollection.length;
  while (testId < length) {
    wrappedTests.push(execTest(testModules, logger, collectionId, testId));

    testId += 1;
  }

  await Promise.all(wrappedTests);
}

async function execCollectionOrdered(
  testModules: TestModule[],
  logger: LoggerInterface,
  collectionId: number,
) {
  const { testCollection } = testModules[collectionId];

  const numTests = testCollection.length;
  let index = 0;
  while (index < numTests) {
    if (logger.cancelled) return;
    await execTest(testModules, logger, collectionId, index);

    index += 1;
  }
}

async function startRun(logger: LoggerInterface, testModules: TestModule[]) {
  if (logger.cancelled) return;

  logger.log(testModules, {
    type: "start_run",
    time: performance.now(),
  });

  let collectionId = 0;
  const numCollections = testModules.length;
  while (collectionId < numCollections) {
    if (logger.cancelled) return;
    logger.log(testModules, {
      type: "start_collection",
      time: performance.now(),
      collectionId,
    });

    const { options } = testModules[collectionId];

    options.runAsynchronously
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

function cancelRun(logger: LoggerInterface, testModules: TestModule[]) {
  if (logger.cancelled) return;
  logger.log(testModules, {
    type: "cancel_run",
    time: performance.now(),
  });
}

export { startRun, cancelRun };
