// brian taylor vann
// store

import type {
  Action,
  BroadcastData,
  Store as XStore,
  StoreAction,
  StoreInterface,
  Subscription,
  StoreContext,
} from "../utils/jackrabbit_types.ts";

import { BUILD_RUN } from "../utils/constants.ts";

import { actions } from "./actions.ts";
import { Broadcaster } from "./broadcaster.ts";


type Translate<D, B> = (source: D, target?: B) => B;

class Store<D, B, A extends Action> implements StoreInterface<D, A>  {
  private ctx: StoreContext<D, A>;
  private data: B;
  private convert: Translate<D, B>;

  constructor(ctx: StoreContext<D, A>, convert: Translate<D, B>) {
    this.ctx = ctx;
    this.convert = convert;
    this.data = this.convert(this.ctx.data)
  }

  dispatch(action: A) {
    const reaction = this.ctx.reactions[action.type];
    if (reaction === undefined) return;

    reaction(this.ctx.data, action);

    this.data = this.convert(this.ctx.data, this.data);
  }

  getState(): B {
    return this.data; 
  }
}

class StoreBroadcaster<D, A extends Action> implements StoreInterface<D. A> {
  private store: XStore;
  private subscription: Subscription<D>;

  constructor(store: XStore, subscription: Subscription<D>) {
    this.store = store;
    this.subscription = subscription;
  }

  dispatch(action: A) {
    this.store.dispatch(action);
    this.subscription(this.store.getState())
  }

  getState() {
    return this.store.getState();
  }
}

// Action.type, (storeData, action)

export { StoreBroadcaster, Store };
