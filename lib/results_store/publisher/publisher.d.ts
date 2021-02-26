import { Subscription } from "../../pubsub/pubsub";
import { TestRunResults } from "../state_store/state_types/state_types";
declare type UnsubscribeToResults = () => void;
declare type SubscribeToResults = (resultsCallback: Subscription<TestRunResults>) => UnsubscribeToResults;
declare type BroadcastResults = (testRunState: TestRunResults) => void;
declare const subscribe: SubscribeToResults;
declare const broadcast: BroadcastResults;
export { broadcast, subscribe };
