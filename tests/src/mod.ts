function testTheStuff() {
  return ["this test failed!"];
  // return [];

}

let collection = {
  title: import.meta.url,
  runAsynchronously: false,
  tests: [testTheStuff],
};

let collections = [collection];

export { collections };
