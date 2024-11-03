# Jackrabbit

Tests without dependencies.

A test runner without dependencies.

## Basics

A `test` is a function that returns assertions.

A `test module` is a javascript module that exports an array of `tests`.

A `test collection` is javascript module that exports an array of `test modules`.

A `test runner` (jackrabbit) loads `test collections` and logs test results.

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

Jackrabbit was inspired years of unnecessary pain caused by dogmatic BDD from corporate impact chasers.

Jackrabbit decouples tests from test runners.

If a developer understands Javascript modules and POJOs, they can immediately write Jackrabbit tests.

This lets developers focus on testing their code rather than investing time in esoteric domain knowledge.

Jackrabbit provides a test runner. However, developers could use their own test runner and never need to change their tests.

## License

BSD 3-Clause License
