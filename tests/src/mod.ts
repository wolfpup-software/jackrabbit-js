function testTheStuff() {
  return [];
}

let collection = {
  title: "Demo_test",
  runAsynchronously: false,
  tests: [testTheStuff],
};

let collections = [collection];

export { collections };
