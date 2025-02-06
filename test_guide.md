# Jackrabbit Tests

## Assertions

In jackrabbit, an assertion can be a string, an array of strings, or the `undefined` primitive.

```TS
type Assertions = string | string[] | undefined;
```

## Tests

Tests are functions that return assertions.

Tests `pass` when they return the `undefined` primitive or an empty array.

```TS
// my_library.tests.ts

function testStuffAndPass() {
	return;
}

async function testMoreStuffAndPass() {
	return [];
}
```

Any other value will cause a test to `fail`.

So tests that `fail` look like:

```TS
// my_library.tests.ts

function testStuffAndFail() {
	return "this test failed!";
}

function testMoreStuffAndFail() {
	return ["this test also failed!"];
}
```

## Test Modules

Test Modules are javascript `modules`.

## Export Tests

Test Modules export their tests in an array called `tests`.

```TS
// my_library.tests.ts

export const tests = [
	testStuffAndPass,
	testMoreStuffAndPass,
	testStuffAndFail,
	testMoreStuffAndFail,
];
```

### Export Test Options

Export a pojo named `options` with the following properties to affect test behavior:

```TS
// my_library.tests.ts

interface Options {
  title?: string;
  runAsynchronously?: boolean;
  timeoutInterval?: number;
}

export const options = {
	title: import.meta.url,
	runAsyncronously: true,
	timeoutInterval: 3000,
}
```

Tests will run sequentially, unless `runAsyncronously` is `true`.

## Test Collections

A `test collection` is a javascript module that exports a list of all relavent test modules called `testModules`.

```TS
// mod.test.ts

import * as MyTests from "./my_library.tests.ts";

export const testModules = [
	MyTests
];
```

## Run Test Collections

Jackrabbit logs the results of `test collections`.

```sh
npx jackrabbit --file ./mod.test.ts
```

## License

BSD 3-Clause License
