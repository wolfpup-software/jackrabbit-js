// brian taylor vann
// broadcaster

import type { Subscription, TestBroadcaster } from "../jackrabbit_types.ts";

class Broadcaster<T> implements TestBroadcaster<T> {
  private receipt = -1;
  private subscriptions = new Map<number, Subscription<T>>();

  subscribe(resultsCallback: Subscription<T>): number {
    this.receipt += 1;
    this.subscriptions.set(this.receipt, resultsCallback);

    return this.receipt;
  }

  unsubscribe(receipt: number): void {
    this.subscriptions.delete(receipt);
  }

  broadcast(message: T) {
    for (const subscription of this.subscriptions.values()) {
      subscription(message);
    }
  }
}

export { Broadcaster };
