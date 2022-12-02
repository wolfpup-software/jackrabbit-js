import type {
  RunnerInterface,
  StoreInterface,
} from "../utils/jackrabbit_types.ts";

import { cancelRun, execRun } from "./async_reactions.ts";

class Runner implements RunnerInterface {
  cancel(store: StoreInterface) {
    cancelRun(store);
  }

  async run(store: StoreInterface) {
    await execRun(store);
  }
}

export { Runner };

