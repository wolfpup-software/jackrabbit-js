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
  moduleId: number,
  testId: number,
) {
  if (logger.cancelled) return;
  logger.log(testModules, {
    type: "start_test",
    time: performance.now(),
    testId,
    moduleId,
  });

  const { tests, options } = testModules[moduleId];

  const testFunc = tests[testId];
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
    moduleId,
    assertions,
    endTime,
    startTime,
  });
}

async function execCollection(
  testModules: TestModule[],
  logger: LoggerInterface,
  moduleId: number,
) {
  const { tests } = testModules[moduleId];

  const wrappedTests = [];
  let testId = 0;
  const length = tests.length;
  while (testId < length) {
    wrappedTests.push(execTest(testModules, logger, moduleId, testId));

    testId += 1;
  }

  await Promise.all(wrappedTests);
}

async function execCollectionOrdered(
  testModules: TestModule[],
  logger: LoggerInterface,
  moduleId: number,
) {
  const { tests } = testModules[moduleId];

  const numTests = tests.length;
  let index = 0;
  while (index < numTests) {
    if (logger.cancelled) return;
    await execTest(testModules, logger, moduleId, index);

    index += 1;
  }
}

async function startRun(logger: LoggerInterface, testModules: TestModule[]) {
  if (logger.cancelled) return;

  logger.log(testModules, {
    type: "start_run",
    time: performance.now(),
  });

  let moduleId = 0;
  const numCollections = testModules.length;
  while (moduleId < numCollections) {
    if (logger.cancelled) return;
    logger.log(testModules, {
      type: "start_module",
      time: performance.now(),
      moduleId,
    });

    const { options } = testModules[moduleId];
    options?.runAsynchronously
      ? await execCollection(testModules, logger, moduleId)
      : await execCollectionOrdered(testModules, logger, moduleId);

    if (logger.cancelled) return;
    logger.log(testModules, {
      type: "end_module",
      time: performance.now(),
      moduleId,
    });

    moduleId += 1;
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
