"use strict";
// brian taylor vann
// PubSub
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
class PubSub {
    constructor() {
        this.stub = 0;
        this.recycledStubs = [];
        this.subscriptions = {};
    }
    getStub() {
        const stub = this.recycledStubs.pop();
        if (stub !== undefined) {
            return stub;
        }
        this.stub += 1;
        return this.stub;
    }
    subscribe(callback) {
        const stub = this.getStub();
        this.subscriptions[stub] = callback;
        return stub;
    }
    unsubscribe(stub) {
        if (this.subscriptions[stub] != undefined) {
            this.subscriptions[stub] = undefined;
            this.recycledStubs.push(stub);
        }
    }
    broadcast(params) {
        for (const stubKey in this.subscriptions) {
            const subscription = this.subscriptions[stubKey];
            if (subscription !== undefined) {
                subscription(params);
            }
        }
    }
}
exports.PubSub = PubSub;
