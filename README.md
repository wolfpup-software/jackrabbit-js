# Jackrabbit

Tests without dependencies.

A test runner without dependencies.

## Basics

A `test` is a function that returns `assertions`.

A `test module` is an array of `tests` (exported by a javascript module).

A `test collection` is an array of `test modules` (exported by a javascript module).

A `test runner` loads `test collections` and logs test results.

Jackrabbit is a test runner.

## Tests

See [this guide](./JACKRABBIT.md) to create jackrabbit tests.

## Nodejs

### Install

Install jackrabbit with npm via github.

```sh
npm install --save-dev https://github.com/wolfpup-software/jackrabbit-js
```

### Run Test Collections

```sh
jackrabbit --file ./path/to/test/collection/mod.ts
```

## On Decoupling tests from test runners

If a developer understands Javascript modules and POJOs, they can immediately write Jackrabbit tests rather than invest in esoteric domain knowledge.

Jackrabbit provides a test runner. However, developers could use their own test runner and never need to change their tests.

Jackrabbit decouples tests from test runners.

## License

BSD 3-Clause License
