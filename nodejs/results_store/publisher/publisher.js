"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = exports.broadcast = void 0;
const pubsub_1 = require("../../pubsub/pubsub");
const pubSub = new pubsub_1.PubSub();
const subscribe = (resultsCallback) => {
    const stub = pubSub.subscribe(resultsCallback);
    return () => {
        pubSub.unsubscribe(stub);
    };
};
exports.subscribe = subscribe;
// send current state to subscribers
const broadcast = (testRunState) => {
    pubSub.broadcast(testRunState);
};
exports.broadcast = broadcast;
