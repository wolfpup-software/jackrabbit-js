# Jackrabbit

A portable test runner.

## About

Tests are a way of confirming that structures and shapes exist after a given set of operations. They are a byproduct of design. But our tests also affect the design of software, builds, and development environments.

Jackrabbit is designed with the following expectations:
- A testing suite should not be required to write tests
- Logging test results is environment specific (cli, local, remote)

Jackrabbit is an attempt to abstract a test runner from first principles. It allows developers to compose test runners tailored to their projects rather than configure test runners to project specifications.

It uses a `logger` as a way to track test state and it uses `test collections` as a pipeline to provide test state to a `logger`.

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
```

`Test collections` are gathered as list inside a module. This list is later used as a pipeline to generate test state through a `logger`.

```TS
import { myTestCollection } from "./my_test_collection.ts";

const testCollections = [
	myTestCollection,
];

export { testCollections };
```

## Jackrabbit Logger

Jackrabbit has no preference where results are stored or logged. Developers are expected to provide a `logger` context.

The `logger` is provided alongside the `test collections` to `execRun`.

```TS
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

To begin a test run, `test collections` and a `logger` are provided to `startRun` function.

```TS
import { startRun } from "./jackrabbit/mod.ts";
import { testCollections } from "./test_collections.ts";
import { Logger } from "./logger.ts";

const logger = new Logger();

startRun(testCollections, logger);
```

To cancel tests, `test collections` and `logger` are provided to the `cancelRun` function.

```TS
import { cancelRun } from "./jackrabbit/mod.ts";

cancelRun(testCollections, logger);
```

## License

BSD 3-Clause License
