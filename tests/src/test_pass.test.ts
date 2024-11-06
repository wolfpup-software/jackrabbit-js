function testStuffAndPass() {
  return;
}

async function testMoreStuffAndPass() {
  return [];
}

// export tests
export const tests = [testStuffAndPass, testMoreStuffAndPass];

// export optional test details
export const options = {
  title: import.meta.url,
};
