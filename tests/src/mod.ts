function testTheStuff() {
  return ["this test failed!"];
}

function testTheOtherStuff() {}

let collection = {
  title: import.meta.url,
  runAsynchronously: false,
  tests: [testTheStuff, testTheOtherStuff],
};

let collections = [collection];

export { collections };
