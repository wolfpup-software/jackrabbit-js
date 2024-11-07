function testStuffAndPass() {
    return;
}
function testMoreStuffAndPass() {
    return [];
}
async function testStuffAndPassAsync() {
    return;
}
async function testMoreStuffAndPassAsync() {
    return [];
}
// export tests
export const tests = [
    testStuffAndPass,
    testMoreStuffAndPass,
    testStuffAndPassAsync,
    testMoreStuffAndPassAsync,
];
// export optional test details
export const options = {
    title: import.meta.url,
};
