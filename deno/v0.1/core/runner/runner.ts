import type {
  Collection,
  LoggerInterface,
  RunnerInterface,
} from "../utils/jackrabbit_types.ts";

import { cancelRun, execRun } from "./async_reactions.ts";

// we instantiate here with logger
// we dont need a store to dispatch
//
class Runner implements RunnerInterface {
  cancel(collections: Collections[], logger: LoggerInterface) {
    cancelRun(collections, logger);
  }

  async run(collections: Collection[], logger: LoggerInterface) {
    execRun(collections, logger);
  }
}

export { cancelRun, execRun, Runner };
