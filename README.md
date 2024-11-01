# Jackrabbit

A test runner without dependencies.

## Abstract

A `test` is a function that returns assertions.

A `test module` is a javascript module that exports an array of`tests` named `tests`.

A `test collection` is javascript module that exports an array of `test modules` named `testModules`.

A test runner (jackrabbit) loads `test modules` and logs test results.

## Jackrabbit tests

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

Jackrabbit decouples tests from test runners.

If a developer understands Javascript modules and POJOs, they can immediately write Jackrabbit tests.

This lets developers focus on testing their code rather than investing time in esoteric domain knowledge.

Jackrabbit provides a test runner. However, developers could use their own test runner and never need to change their tests.

Jackrabbit was inspired years of dogmatic and unnecessary pain caused by BDD and corporate impact chasers.

## License

BSD 3-Clause License
