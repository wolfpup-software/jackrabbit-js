declare type Subscription<T> = (params: T) => void;
declare class PubSub<T> {
    private stub;
    private recycledStubs;
    private subscriptions;
    private getStub;
    subscribe(callback: Subscription<T>): number;
    unsubscribe(stub: number): void;
    broadcast(params: T): void;
}
export type { Subscription };
export { PubSub };
