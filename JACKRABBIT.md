# Jackrabbit

A test runner without dependencies

## Abstract

Jackrabbit decouples tests from test runners.

This lets developers focus on testing their code rather than investing time in esoteric domain knowledge.

If a developer understands Javascript modules and POJOs, they are ready to write Jackrabbit tests.

No more:

- versioning
- assertion libraries
- dependency injections
- BDD syntax

Jackrabbit provides a test runner, but developers could create their own test runner and never change their tests.

## Jackrabbit Tests

### Assertions

Jackrabbit tests are simply functions that return assertions.

An assertion is defined by the following:

```TS
type Assertions = string[] | string | undefined;
```

### Tests

Tests are just functions.

A `pass` is any assertion equal to an empty array or undefined. Any other return value will be a `fail`.

So `failing` `tests` looks like the following:

```TS
// myTests.ts

function testStuffAndFail() {
	return "this test failed!";
}

function testMoreStuffAndFail() {
	return ["this test also failed!"];
}
```

And `passing` tests look like:

```TS
// myTests.ts

function testStuffAndPass() {
	return;
}

async function testMoreStuffAndPass() {
	return [];
}
```

### Export tests

Test files should export their tests! Tests will be executed in sequential order (unless otherwise specified)

```TS
// myTests.ts

export const tests = [
	testStuffAndFail,
	testMoreStuffAndFail,
	testStuffAndPass,
	testMoreStuffAndPass,
];
```

### Details

You can export a pojo called details to describe a test:

```TS
// myTests.ts

export const details = {
	title: import.meta.url,
	runAsyncronously: true,
}
```

### Test Collections

Finally, a test collection is a module that imports

```TS
// testCollection.ts

import * as MyTests from "./my-tests.js";

export const testCollection = [
	myTests
]
```

## License

BSD 3-Clause License
