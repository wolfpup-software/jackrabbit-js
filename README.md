# Jackrabbit

A portable test runner.

## About

Jackrabbit is a portable test runner that logs tests in a json serializable
format.

Jackrabbit is designed with the following expectations:
- A testing suite should not be required to write tests
- Logging is contextual

## Jackrabbit Tests

A test is a context that creates assertions about code.

A function that returns assertions.

```TS
function testTheThings() {
  return ["test failed!"];
}
```

A test collection is a series of tests and some data about how tests should be
run.

```TS
const myTestCollection = {
  title: "Test All The Things",
  runAsyncronously: true,
  tests: [
    testAllTheThings,
  ],
};
```

Test collections are gathered and exported as list inside a module.

```TS
import { myTestCollection } from "./my_test_collection.ts";

const testCollections = [
	myTestCollection,
];

export { testCollections };
```

## Jackrabbit Logger

Jackrabbit has no preference where results are stored or logged.

A "logger" is provided alongside a series of test collections.

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

Test collections and a Logger are provided to `execRun`.

```TS
import { Logger } from "./logger.ts";
import { testCollections } from "./test_collections.ts";
import { execRun } from "./jackrabbit/mod.ts";


execRun(testCollections, Logger);
```

## Yet another test runner

Testing is a byproduct of design.

Tests are a way of confirming that structures and shapes exist after a given set of operations.

However, it's difficult to find source material or guidance for building a test runners. How the test runner works is rarely talked about.

This is suspect.

Instead, what I've observed (especially in the JS domain) is a philosophically dogmatic approach to testing that pollutes any / every build system.

Jackrabbit is an attempt to abstract a test runner from first principles.

It uses a "logger" as a way to track fails and test state. And it uses tests as a functional pipeline to generate state through a "logger".

ie:
```
struct -> functional pipeline -> struct
logger -> tests -> logger
```

## License

BSD 3-Clause License
