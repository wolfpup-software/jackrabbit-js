// brian taylor vann
// actions

import type {
  Assertions,
  Collection,
  LoggerInterface,
} from "../utils/jackrabbit_types.ts";

import {
  CANCEL_RUN,
  CANCELLED,
  END_COLLECTION,
  END_RUN,
  END_TEST,
  START_COLLECTION,
  START_RUN,
  START_TEST,
} from "../utils/constants.ts";

/*
  All asyncronous logic resides here.

  Syncronous calls are made to the store from the asyncronus logic below.
*/

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

  return [`timed out at: ${timeoutInterval}`];
};

function runIsCancelled(logger: LoggerInterface): boolean {
  return logger.cancelled;
}

// test ID
// collection
async function execTest(
  collections: Collection[],
  logger: LoggerInterface,
  collectionId: number,
  testId: number,
) {
  if (runIsCancelled(logger)) return;
  logger.log(
    collections,
    {
      type: START_TEST,
      testId,
      collectionId,
      time: performance.now(),
    },
  );
  
  // get test
  // 

  const startTime = performance.now();
  const assertions = await Promise.race([
    createTimeout(timeoutInterval),
    testFunc(),
  ]);
  const endTime = performance.now();

  if (runIsCancelled(logger)) return;
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
  if (runIsCancelled(logger)) return;

  logger.log(collections, {
    type: START_COLLECTION,
    time: performance.now(),
    collectionId,
  });

  // wrap tests
  const results = await Promise.all(tests);

  // iterate through tests

  if (runIsCancelled(logger)) return;

  logger.log(collections, {
    type: END_COLLECTION,
    endTime: performance.now(),
    collectionId,
  });
}

async function execCollectionOrdered(
  collections: Collection[],
  logger: LoggerInterface,
  collectionId: number,
) {
  if (runIsCancelled(logger)) return;

  logger.log(collections, {
    type: START_COLLECTION,
    time: performance.now(),
    collectionId,
  });

  // iterate through tests and track id
  let index = 0;
  while (index < collections[collectionId].tests.length) {
    if (runIsCancelled(logger)) return;

    await execTest(collections, logger, collectionId, index);

    index += 1;
  }

  if (runIsCancelled(logger)) return;

  logger.log(collections, {
    type: END_COLLECTION,
    time: performance.now(),
    collectionId,
  });
}

// logger meets loader : logger
async function execRun(collections: Collection[], logger: LoggerInterface) {
  logger.log(collections, {
    type: START_RUN,
    time: performance.now(),
  });

  let index = 0;
  while (index < collections.length) {
    if (runIsCancelled(logger)) return;

    const collection = collections[index];
    collection.runTestsAsynchronously
      ? await execCollection(collections, logger, index)
      : await execCollectionOrdered(collections, logger, index);

    index += 1;
  }

  if (runIsCancelled(logger)) return;
  logger.log(collections, {
    type: END_RUN,
    time: performance.now(),
  });
}

function cancelRun(collections: Collection[], logger: LoggerInterface) {
  logger.log(collections, {
    type: CANCEL_RUN,
    time: performance.now(),
  });
}

export { cancelRun, execRun };
