import { PubSub } from "../../pubsub/pubsub";
const pubSub = new PubSub();
const subscribe = (resultsCallback) => {
    const stub = pubSub.subscribe(resultsCallback);
    return () => {
        pubSub.unsubscribe(stub);
    };
};
// send current state to subscribers
const broadcast = (testRunState) => {
    pubSub.broadcast(testRunState);
};
export { broadcast, subscribe };
