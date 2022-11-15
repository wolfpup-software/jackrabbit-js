# Jackrabbit

A portable test runner.

## About

Jackrabbit is a portable test runner that logs tests in a json serializable
format.

A test is a context that creates assertions about code.

A function that returns assertions.

That's what a test is in Jackrabbit: a function that returns assertions.

```JS
function testTheThings() {
    return ["test failed!"];
}
```

A test collection is a series of tests and some data about how tests should be run.

```JS
const collection = {
    title: "Test All The Things",
    runAsyncronously: true,
    tests: [
        testAllTheThings,
    ]
}
```



## License

BSD 3-Clause License
