"use strict";
// brian taylor vann
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStub = exports.getStub = void 0;
let stub = 0;
const getStub = () => {
    return stub;
};
exports.getStub = getStub;
const updateStub = () => {
    stub += 1;
    return stub;
};
exports.updateStub = updateStub;
