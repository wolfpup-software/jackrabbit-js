// brian taylor vann
let stub = 0;
const getStub = () => {
    return stub;
};
const updateStub = () => {
    stub += 1;
    return stub;
};
export { getStub, updateStub };
