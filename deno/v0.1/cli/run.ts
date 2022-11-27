import type { Collection, Config, Importer } from "./deps.ts";
import type { LogsInterface } from "./logs.ts";

import { Runner, Store } from "./deps.ts";

async function run(config: Config, importer: Importer, logs: Logs) {
  for (const file of config.files) {
    const { tests } = await importer.load(file);

    const store = new Store(tests, logs);
    const runner = new Runner();
    await runner.run(store);
  }
}

export { run };
