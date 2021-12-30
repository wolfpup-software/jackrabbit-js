// brian taylor vann
// receipt

type GetStub = () => number;
type UpdateStub = GetStub;

let stub = 0;

const getStub: GetStub = () => {
  return stub;
};

const updateStub: UpdateStub = () => {
  stub += 1;
  stub %= 4096;

  return stub;
};

export { getStub, updateStub };
