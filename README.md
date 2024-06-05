# Jackrabbit

A portable test runner.

Jackrabbit was built with the following expectations:
- A test suite should not be required to write tests
- Logging test results is environment specific (cli, local, remote)

## About

Jackrabbit was desinged without any environment in mind. Developers compose test runners tailored to their projects rather than configure test runners to project specifications.

Jackrabbit uses a `logger` as a way to track test state and it uses `test collections` as a kind of pipeline to provide test state to the `logger`.

ie:
```
struct -> functional pipeline -> struct
logger -> tests -> logger
```

## Jackrabbit Tests

A `test` is a context that creates assertions about code.

This can be defined by a function that returns an array of strings.

In Jackrabbit, a `test` looks like the following:

```TS
function testTheThings() {
  return ["test failed!"];
}
```

A `test collection` is a series of tests and some data about how tests should be
run.

In Jackrabbit, a `test colleciton` looks like the following:

```TS
const myTestCollection = {
  title: "Test All The Things",
  runAsyncronously: true,
  tests: [
    testAllTheThings,
  ],
};

export { myTestCollection };
```

`Test collections` are gathered as a list inside a module. The list is used as a kind of pipeline to that sends test state to a `logger`.

```TS
import { myTestCollection } from "./my_test_collection.ts";

const testCollections = [
  myTestCollection,
];

export { testCollections };
```

## Jackrabbit Logger

Jackrabbit has no preference where results are stored or logged. Developers are expected to provide a `logger` context.

The `logger` is provided alongside the `test collections` to `startRun`.

```TS
// logger.ts

import type { Collection, LoggerAction, LoggerInterface } from "./mod.ts";

class Logger implements LoggerInterface {
  cancelled = false;
  log(collections: Collection[], action: LoggerAction) {
    ... save to hard drive
    ... send to server
    ... wait until test run is complete
	}
}
```

## Jackrabbit Run

To begin a test run, pass `test collections` and a `logger` to the `startRun` function.

```TS
import { startRun } from "./jackrabbit/mod.ts";

import { testCollections } from "./test_collections.ts";
import { Logger } from "./logger.ts";

const logger = new Logger();

startRun(testCollections, logger);
```

To cancel tests, pass `test collections` and `logger` to the `cancelRun` function.

```TS
import { cancelRun } from "./jackrabbit/mod.ts";

cancelRun(testCollections, logger);
```

## License

BSD 3-Clause License
