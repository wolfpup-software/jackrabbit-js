// A basic Jackrabbit test

function testStuffAndFail() {
  return "this test failed!";
}

function testMoreStuffAndFail() {
  return ["this test also failed!"];
}

function testStuffAndPass() {
  return;
}

async function testMoreStuffAndPass() {
  return [];
}

// export tests
export const tests = [
  testStuffAndFail,
  testMoreStuffAndFail,
  testStuffAndPass,
  testMoreStuffAndPass,
];

// export optional test details
export const details = {
  title: import.meta.url,
  runAsyncronously: true,
};
