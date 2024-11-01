# Jackrabbit

Jackrabbit decouples tests from test runners.

This lets developers focus on testing their code rather than investing time in esoteric domain knowledge.

If a developer understands Javascript modules and POJOs, they are ready to write Jackrabbit tests.

Jackrabbit provides a test runner. However, developers could use their own test runner and never need to change their tests.

## Jackrabbit Tests

### Assertions

Jackrabbit tests are simply functions that return assertions.

An assertion is defined by the following:

```TS
type Assertions = string[] | string | undefined;
```

### Tests

Tests are functions that return assertions.

Any assertion equal to an empty array or undefined is a `pass`. Any other return value will be a `fail`.

So tests that `fail` looks like the following:

```TS
// my-tests.ts

function testStuffAndFail() {
	return "this test failed!";
}

function testMoreStuffAndFail() {
	return ["this test also failed!"];
}
```

And tests that `pass` tests look like:

```TS
// my-tests.ts

function testStuffAndPass() {
	return;
}

async function testMoreStuffAndPass() {
	return [];
}
```

### Export tests

A test module should export their tests. Tests will be executed in sequential order (unless otherwise specified).

```TS
// my-tests.ts

export const tests = [
	testStuffAndFail,
	testMoreStuffAndFail,
	testStuffAndPass,
	testMoreStuffAndPass,
];
```

### Options

Export a pojo called options to affect test behavior:

```TS
// my-tests.ts

export const options = {
	title: import.meta.url,
	runAsyncronously: true,
}
```

### Test Modules

Finally, a module collects all relavent test modules.

```TS
// mod.test.ts

import * as MyTests from "./my-tests.js";

export const testModules = [
	MyTests
];
```

## License

BSD 3-Clause License
