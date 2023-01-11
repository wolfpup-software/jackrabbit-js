# Jackrabbit

A portable test runner.

## About

Jackrabbit is a portable test runner that logs tests in a json serializable
format.

A test is a context that creates assertions about code.

A function that returns assertions.

```JS
function testTheThings() {
  return ["test failed!"];
}
```

A test collection is a series of tests and some data about how tests should be
run.

```JS
const collection = {
  title: "Test All The Things",
  runAsyncronously: true,
  tests: [
    testAllTheThings,
  ],
};
```

Test collections are run by 

## Why

Testing is a by product of design.

A shape or context or result or structure is expected from a chunk of code.

Tests are a way of confirming that structures and shapes exist.

However, it's difficult to find source material for building a test runners.

It's difficult to find opinions about patterns used in test runners.

Instead, what I've observed is philosophically dogmatic approaches to tests: behavioral, acceptance, etc.

How the test runner works is rarely talked about. Which is suspect.

This an attempt to show how a test runner can be created from first principles.

## License

BSD 3-Clause License
