// brian taylor vann
// actions

import type {
  Assertions,
  Collection,
  LoggerInterface,
} from "../utils/jackrabbit_types.ts";

import {
  CANCEL_RUN,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  START_COLLECTION,
  START_RUN,
  START_TEST,
} from "../utils/constants.ts";

type CreateTimeout = (requestedInterval: number) => Promise<Assertions>;
type Sleep = (time: number) => Promise<void>;

const TIMEOUT_INTERVAL = 10000;

const sleep: Sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const createTimeout: CreateTimeout = async (timeoutInterval: number) => {
  const interval = timeoutInterval === -1 ? TIMEOUT_INTERVAL : timeoutInterval;
  await sleep(interval);

  return [`timed out at: ${interval}`];
};

async function execTest(
  collections: Collection[],
  logger: LoggerInterface,
  collectionId: number,
  testId: number,
) {
  if (logger.cancelled) return;
  logger.log(
    collections,
    {
      type: START_TEST,
      time: performance.now(),
      testId,
      collectionId,
    },
  );

  const testFunc = collections[collectionId].tests[testId];
  const startTime = performance.now();
  const assertions = await Promise.race([
    createTimeout(collections[collectionId].timeoutInterval),
    testFunc(),
  ]);
  const endTime = performance.now();

  if (logger.cancelled) return;
  logger.log(collections, {
    type: END_TEST,
    testId,
    collectionId,
    assertions,
    endTime,
    startTime,
  });
}

async function execCollection(
  collections: Collection[],
  logger: LoggerInterface,
  collectionId: number,
) {
  const wrappedTests = [];
  let testId = 0;
  const length = collections[collectionId].tests.length;
  while (testId < length) {
    wrappedTests.push(
      execTest(collections, logger, collectionId, testId),
    );

    testId += 1;
  }

  await Promise.all(wrappedTests);
}

async function execCollectionOrdered(
  collections: Collection[],
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

async function execRun(collections: Collection[], logger: LoggerInterface) {
  if (logger.cancelled) return;
  logger.log(collections, {
    type: START_RUN,
    time: performance.now(),
  });

  let collectionId = 0;
  const numCollections = collections.length;
  while (collectionId < numCollections) {
    if (logger.cancelled) return;
    logger.log(collections, {
      type: START_COLLECTION,
      time: performance.now(),
      collectionId,
    });

    collections[collectionId].runTestsAsynchronously
      ? await execCollection(collections, logger, collectionId)
      : await execCollectionOrdered(collections, logger, collectionId);

    if (logger.cancelled) return;
    logger.log(collections, {
      type: END_COLLECTION,
      time: performance.now(),
      collectionId,
    });

    collectionId += 1;
  }

  if (logger.cancelled) return;
  logger.log(collections, {
    type: END_RUN,
    time: performance.now(),
  });
}

function cancelRun(collections: Collection[], logger: LoggerInterface) {
  if (logger.cancelled) return;
  logger.log(collections, {
    type: CANCEL_RUN,
    time: performance.now(),
  });
}

export { cancelRun, execRun };
