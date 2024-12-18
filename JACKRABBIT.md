# Jackrabbit Tests

## Assertions

An assertion is defined by the following types:

```TS
type Assertions = string[] | string | undefined;
```

## Tests

Tests are functions that return assertions.

An empty array or an undefined value is considered a `pass`. Any other return value is a `fail`.

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

## Test Modules

### Export Tests

A `test module` should export their tests. Tests will be executed in sequential order (unless specified otherwise).

```TS
// my-tests.ts

export const tests = [
	testStuffAndFail,
	testMoreStuffAndFail,
	testStuffAndPass,
	testMoreStuffAndPass,
];
```

### Export Test Options

Export a pojo called `options` to affect test behavior:

```TS
// my-tests.ts

interface Options {
  title?: string;
  runAsynchronously?: boolean;
  timeoutInterval?: number;
}

...

export const options = {
	title: import.meta.url,
	runAsyncronously: true,
	timeoutInterval: 3000,
}
```

## Test Collections

A `test collection` is a javascript module that exports all relavent test modules into one collection.

```TS
// mod.test.ts

import * as MyTests from "./my-tests.js";

export const testModules = [
	MyTests
];
```

## Run Test Collections

Jackrabbit is a test runner logs the results of `test collections`.

```sh
npx jackrabbit --file ./mod.test.ts
```

## On Decoupling tests from test runners

Jackrabbit decouples tests from test runners.

If a developer understands Javascript modules and POJOs, they can immediately write Jackrabbit tests.

Developers can bring their own test runner and never change their tests.

## License

BSD 3-Clause License
