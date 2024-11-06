function testStuffAndFail() {
  return "this test failed!";
}

function testMoreStuffAndFail() {
  return ["this test also failed!"];
}

// export tests
export const tests = [testStuffAndFail, testMoreStuffAndFail];

// export optional test details
export const options = {
  title: import.meta.url,
};
