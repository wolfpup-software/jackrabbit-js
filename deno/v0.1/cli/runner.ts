import type { ConfigInterface } from "./cli_types.ts";
import type { Logs } from "./logs.ts";

import { Runner, Store } from "./deps.ts";

async function runCollections(files: string[], logs: Logs) {
  for (const file of files) {
    const { tests } = await import(file);

    const store = new Store();
    store.setup(tests, logs.log);

    const jr = new Runner();
    await jr.run(store);

    store.teardown();
  }
}

// StoreData,
class Runner {
  run(config: ConfigInterface, logs: Logs) {
    const cnf = config.getConfig();
    runCollections(config.getConfig().files, logs);
  }
}

export { Runner };
