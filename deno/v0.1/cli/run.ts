import type { ConfigInterface } from "./cli_types.ts";
import type { ImporterInterface } from "./deps.ts";
import type { LoggerInterface } from "./logs.ts";

import { Runner, Store } from "./deps.ts";

async function run(
  config: ConfigInterface,
  importer: ImporterInterface,
  logs: LoggerInterface,
) {
  for (const file of config.files) {
    const tests = await importer.load(file);

    const store = new Store(tests, logs);
    const runner = new Runner();
    await runner.run(store);
  }
}

export { run };
