# Jackrabbit

A test runner without dependencies

## Jackrabbit Tests

### Tests

In Jackrabbit, a `test` looks like the following:

```TS
function testTheStuff() {
  return ["this test failed!"];
}
```

Assertions are simply an array of strings, with each string describing a failure.

Tests without assertions, return an empty array (or undefined).

## License

BSD 3-Clause License
